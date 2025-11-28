# Affiliate Meta Site

Simple Next.js App Router project that:

- Reads a JSON file containing only affiliate URLs
- Fetches each page's OpenGraph meta (title, image, description)
- Displays them as product cards
- **Auto-categorizes** products by store hostname (e.g., `amazon.in`, `flipkart.com`)
- Includes a **search bar** (filter by title or store)
- Has **pagination + infinite scroll** (loads more products as you scroll)
- Tracks clicks per session (visible under each card)
- Provides **multiple pages**:
  - `/` – all products
  - `/stores` – list of stores
  - `/store/[store]` – products from a single store
- "View on Store" button opens the affiliate link in a new tab

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Updating Products

Edit `data/products.json` and add or remove URLs:

```json
[
  "https://www.amazon.in/dp/XXXXXXXX",
  "https://www.flipkart.com/your-product",
  "https://example.com/affiliate-link"
]
```

No other changes are required. The site will automatically pick up new URLs on the next build / regeneration.

## Notes

- This uses OpenGraph and meta tags from the target pages. Some sites may block scraping or not expose all info.
- For production-level affiliate projects, consider using official APIs (e.g., Amazon Product Advertising API).
- Infinite scroll is implemented on top of client-side pagination for a smooth UX.
