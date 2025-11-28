import productUrls from "@/data/products.json";
import { fetchProductMeta, extractHostname } from "@/lib/fetchProductMeta";
import ProductListClient from "@/app/components/ProductListClient";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type Params = {
  params: {
    store: string;
  };
};

export async function generateStaticParams() {
  const urls = productUrls as string[];
  const stores = Array.from(new Set(urls.map((url) => extractHostname(url))));
  return stores.map((store) => ({ store }));
}

export default async function StorePage({ params }: Params) {
  const { store } = params;
  const urls = productUrls as string[];
  const metaList = await Promise.all(urls.map((url) => fetchProductMeta(url)));
  const filtered = metaList.filter((p) => p.store === store);

  if (filtered.length === 0) {
    notFound();
  }

  return (
    <main className="bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ProductListClient
          products={filtered}
          initialStore={store}
          showStoreLinks={false}
        />

        <footer className="mt-8 text-xs text-gray-500 border-t border-gray-200 pt-4">
          <p className="mb-1">
            Showing products only from{" "}
            <span className="font-mono">{store}</span>.
          </p>
          <p className="mb-1">
            Go back to{" "}
            <a href="/" className="underline text-orange-600">
              all stores
            </a>
            .
          </p>
          <p>
            Disclaimer: Prices, availability and other details may change at any
            time. Please verify all information on the store page before
            purchasing.
          </p>
        </footer>
      </div>
    </main>
  );
}
