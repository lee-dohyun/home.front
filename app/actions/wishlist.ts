'use server';

import { headers } from 'next/headers';

export async function toggleWishlist(productId: number, isCurrentlyWishlisted: boolean) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  
  if (!userId) {
    throw new Error('Not logged in');
  }

  const baseUrl = process.env.PRODUCT_API_URL || "http://product-api.customer.svc.cluster.local:8080";
  const url = isCurrentlyWishlisted 
    ? `${baseUrl}/api/wishlists/${productId}`
    : `${baseUrl}/api/wishlists?productId=${productId}`;

  const response = await fetch(url, {
    method: isCurrentlyWishlisted ? 'DELETE' : 'POST',
    headers: {
      'X-User-Id': userId
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to toggle wishlist: ${response.status}`);
  }
}
