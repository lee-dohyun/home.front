import { NextResponse } from 'next/server';
import { fetchProductApi } from '@/lib/product-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '10';

  try {
    const data = await fetchProductApi(`/api/products/main/new?limit=${limit}`, {
      next: { revalidate: 300 }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch new products:', error);
    return NextResponse.json([]);
  }
}
