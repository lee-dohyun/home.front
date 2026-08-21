'use server';

import { fetchProductApi } from '@/lib/product-api';

export interface ProductSummary {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  stockQuantity: number;
  thumbnailUrl: string | null;
}

export async function fetchProductsByIds(ids: number[]): Promise<ProductSummary[]> {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const p = await fetchProductApi(`/api/products/${id}`);
        const thumbnailUrl = p.images && p.images.length > 0 ? p.images[0].imageUrl : null;
        return {
          id: p.id,
          categoryId: p.category?.id || 0,
          name: p.name,
          price: p.price,
          stockQuantity: p.stockQuantity,
          thumbnailUrl,
        } as ProductSummary;
      } catch {
        return null;
      }
    })
  );
  return results.filter(Boolean) as ProductSummary[];
}
