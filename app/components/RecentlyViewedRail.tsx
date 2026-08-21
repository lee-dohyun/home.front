'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlueprintCorners } from '@posselect/ui';
import { fetchProductsByIds, ProductSummary } from '../actions/product';

export default function RecentlyViewedRail() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentlyViewed() {
      if (typeof window === 'undefined' || !window.posselect?.recentlyViewed) {
        setLoading(false);
        return;
      }
      
      try {
        const items = window.posselect.recentlyViewed.get();
        if (items.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const ids = items.map(i => i.id);
        const data = await fetchProductsByIds(ids);
        
        // 정렬 순서 유지 (최근 본 순서대로)
        const sortedData = [];
        for (const id of ids) {
          const found = data.find(d => d.id === id);
          if (found) sortedData.push(found);
        }
        
        setProducts(sortedData);
      } catch (error) {
        console.error('Failed to load recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentlyViewed();

    const handleChange = () => {
      loadRecentlyViewed();
    };

    window.addEventListener('posselect:recently-viewed-change', handleChange);
    return () => {
      window.removeEventListener('posselect:recently-viewed-change', handleChange);
    };
  }, []);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section style={{ marginBottom: "var(--space-8)" }}>
      <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: "var(--space-4)" }}>최근 본 상품</h2>
      <div className="product-grid">
        {products.map((p) => (
          <Link href={`/products/${p.id}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="card blueprint elev-sm" style={{ cursor: "pointer", height: "100%" }}>
              <BlueprintCorners />
              <div className="product-card-media" style={{ position: "relative", backgroundColor: "#f5f5f5" }}>
                {p.thumbnailUrl ? (
                  <Image src={p.thumbnailUrl} alt={p.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999" }}>이미지 없음</div>
                )}
              </div>
              <div className="product-card-body">
                {p.stockQuantity <= 0 && <div className="card-kicker" style={{ color: "var(--color-danger)" }}>품절</div>}
                <div className="card-title" style={{ fontSize: 14, marginTop: p.stockQuantity <= 0 ? "0.2rem" : "1.2rem" }}>
                  {p.name}
                </div>
                <div className="card-meta product-card-price">{p.price.toLocaleString()}원</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
