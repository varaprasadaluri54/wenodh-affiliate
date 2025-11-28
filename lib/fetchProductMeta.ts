import * as cheerio from "cheerio";

export type ProductMeta = {
  title: string;
  image: string;
  description: string;
  url: string;
  store: string;
};

export async function fetchProductMeta(url: string): Promise<ProductMeta> {
  try {
    const res = await fetch(url, {
      // Try to look like a real browser so Amazon/Flipkart send full HTML
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      },
      redirect: "follow",
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error("Failed to fetch", url, res.status);
      return fallbackMeta(url);
    }

    const finalUrl = res.url || url;
    const html = await res.text();
    const $ = cheerio.load(html);

    // ---- TITLE ----
    const ogTitle =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="title"]').attr("content") ||
      $("title").text();

    // ---- IMAGE (OG first) ----
    let image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content") ||
      "";

    // If no og:image, try Amazon-specific selectors
    if (!image) {
      const landingImg = $("#landingImage");

      // Common Amazon attributes
      image =
        landingImg.attr("data-old-hires") ||
        landingImg.attr("src") ||
        "";

      // Some Amazon pages use data-a-dynamic-image (JSON with URLs)
      if (!image) {
        const dyn = landingImg.attr("data-a-dynamic-image");
        if (dyn) {
          try {
            const obj = JSON.parse(dyn);
            const firstKey = Object.keys(obj)[0];
            if (firstKey) {
              image = firstKey;
            }
          } catch (e) {
            console.warn("Failed to parse data-a-dynamic-image", e);
          }
        }
      }

      // Very last resort: first img on page (not ideal, but better than nothing)
      if (!image) {
        const firstImg = $("img").first().attr("src");
        if (firstImg) {
          image = firstImg;
        }
      }
    }

    // ---- DESCRIPTION ----
    const ogDescription =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    const store = extractHostname(finalUrl);

    return {
      title: ogTitle?.trim() || "Product",
      image: image || "",
      description: ogDescription?.trim() || "",
      url,            // keep your affiliate URL
      store
    };
  } catch (err) {
    console.error("Error fetching meta for", url, err);
    return fallbackMeta(url);
  }
}

export function extractHostname(url: string): string {
  try {
    const u = new URL(url);
    let host = u.hostname.replace(/^www\./, "");

    // 🔁 Normalize known redirect / short domains
    if (host === "linkredirect.in") {
      // Show as Flipkart
      return "flipkart.in"; // or "flipkart.com" if you prefer
    }

    if (host === "fktr.in") {
      // Flipkart short link
      return "flipkart.in";
    }

    if (host === "amzn.to") {
      // Amazon short link
      return "amazon.in";
    }

    return host;
  } catch {
    return "store";
  }
}


function fallbackMeta(url: string): ProductMeta {
  return {
    title: "Product",
    image: "",
    description: "",
    url,
    store: extractHostname(url)
  };
}
