import productUrls from "@/data/products.json";
import { extractHostname } from "@/lib/fetchProductMeta";
import Link from "next/link";

export const revalidate = 3600;

export default function StoresPage() {
  const urls = productUrls as string[];
  const stores = Array.from(new Set(urls.map((url) => extractHostname(url)))).sort();

  return (
    <main className="bg-[#f5f5f5] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Stores</h1>
        <p className="text-sm text-gray-600 mb-4">
          Browse products grouped by store/website hostname.
        </p>
        <ul className="space-y-2">
          {stores.map((store) => (
            <li key={store}>
              <Link
                href={`/store/${encodeURIComponent(store)}`}
                className="inline-flex items-center justify-between w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              >
                <span className="font-mono">{store}</span>
                <span className="text-[11px] text-gray-500">View products →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
