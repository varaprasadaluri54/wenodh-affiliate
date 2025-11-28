import productsRaw from "@/data/products.json";
import { fetchProductMeta } from "@/lib/fetchProductMeta";
import ProductListClient from "./components/ProductListClient";

export const revalidate = 3600; // ISR: re-generate page every hour
type ProductConfig =
  | string
  | {
      url: string;
      title?: string;
      image?: string;
      description?: string;
    };
export default async function HomePage() {
  const urls = productsRaw as string[];
 const items = productsRaw as ProductConfig[];

  const metaList = await Promise.all(
    items.map(async (item) => {
      if (typeof item === "string") {
        // normal case: just a URL
        return fetchProductMeta(item);
      }

      // object: try scraping, then let JSON override anything
      const scraped = await fetchProductMeta(item.url);
      return {
        ...scraped,
        title: item.title ?? scraped.title,
        image: item.image ?? scraped.image,
        description: item.description ?? scraped.description
      };
    })
  );
console.log(metaList,'meta')
  return (
    <main className="bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ProductListClient products={metaList} showStoreLinks />

        <footer className="mt-8 text-xs text-gray-500 border-t border-gray-200 pt-4">
         <p>
            <strong>Disclaimer:</strong> Prices, availability and other details
            may change at any time. Please verify all information on the store
            page before purchasing.
          </p>
        </footer>
      </div>
    </main>
  );
}
