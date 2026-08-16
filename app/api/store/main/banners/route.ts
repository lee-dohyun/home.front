import { NextResponse } from 'next/server';

export async function GET() {
  const banners = [
    {
      id: 1,
      title: "검증된 상품만 엄선했습니다",
      subtitle: "posselect.com 오픈 기념 특별전",
      imageUrl: null,
      link: "/",
      bgColor: "var(--color-primary)"
    },
    {
      id: 2,
      title: "새로운 계절, 신상품 입고",
      subtitle: "트렌드를 선도하는 상품들을 만나보세요",
      imageUrl: null,
      link: "/",
      bgColor: "var(--color-secondary)"
    }
  ];

  return NextResponse.json(banners);
}
