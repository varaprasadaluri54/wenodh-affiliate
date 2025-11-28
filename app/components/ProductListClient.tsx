"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductMeta } from "../../lib/fetchProductMeta";

type Props = {
  products: ProductMeta[];
};

export default function ProductListClient({ products }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 10; // 👈 how many cards per page

  // Filter by search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.store.toLowerCase().includes(q)
    );
  }, [products, query]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const visible = filtered.slice(startIndex, endIndex);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    // Optional: scroll to top of grid
    if (typeof window !== "undefined") {
      const el = document.querySelector(".product-grid");
      if (el) {
        const top = (el as HTMLElement).offsetTop - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Telugu Product Recommendations</h1>
          <p className="page-subtitle">
            The products listed on this page contain affiliate links. When you
            purchase any product, we may earn a small commission at no extra
            cost to you.
          </p>
        </div>
        <div className="page-search">
          <input
            type="text"
            placeholder="Search by name or store..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Pagination summary */}
      <div className="pagination-summary">
        {totalItems === 0 ? (
          <span>No matching products.</span>
        ) : (
          <>
            Showing{" "}
            <strong>
              {startIndex + 1}–{endIndex}
            </strong>{" "}
            of <strong>{totalItems}</strong> products
            {query && (
              <>
                {" "}
                for search "<span className="code-inline">{query}</span>"
              </>
            )}
          </>
        )}
      </div>

      <section className="product-grid">
        {visible.map((p, index) => (
          <article key={p.url + index} className="product-card">
            <div className="product-image-wrapper">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={p.title}
                  className="product-image"
                  loading="lazy"
                />
              ) : (
                <div className="product-image product-image--placeholder">
                  No Image
                </div>
              )}
            </div>

            <div className="product-content">
              <div className="product-header-row">
                <h2 className="product-title">{p.title}</h2>
                <span className="product-store-badge">{p.store}</span>
              </div>

              {p.description && (
                <p className="product-description">{p.description}</p>
              )}

              <div className="product-actions">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-button"
                >
                  View on Store
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>

      {totalItems === 0 && (
        <p className="no-results">No products found for your search.</p>
      )}

      {/* Pagination controls */}
      {totalItems > 0 && totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            ‹ Prev
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  className={
                    "pagination-page" +
                    (pageNumber === currentPage ? " pagination-page--active" : "")
                  }
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next ›
          </button>
        </div>
      )}
    </>
  );
}
