import { NextResponse } from 'next/server';
import { fetchProductApi } from '@/lib/product-api';

export async function GET() {
  try {
    const data = await fetchProductApi(`/api/products/main/by-category`, {
      next: { revalidate: 600 }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    return NextResponse.json({});
  }
}
