import { BlueprintCorners } from "@posselect/ui";
import Image from "next/image";
import Link from "next/link";
import { fetchProductApi } from "@/lib/product-api";

interface ProductSummary {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  stockQuantity: number;
  thumbnailUrl: string | null;
}

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  link: string;
  bgColor: string;
}

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

const TRUST_POINTS = [
  "안전결제 인증 완료",
  "품질 검수를 통과한 상품만 판매",
  "고객센터 평일 09:00~18:00 운영",
];

async function getBestProducts(): Promise<ProductSummary[]> {
  try {
    return await fetchProductApi('/api/products/main/best?limit=10', { next: { revalidate: 300 } });
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getNewProducts(): Promise<ProductSummary[]> {
  try {
    return await fetchProductApi('/api/products/main/new?limit=10', { next: { revalidate: 300 } });
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getProductsByCategory(): Promise<Record<string, ProductSummary[]>> {
  try {
    return await fetchProductApi('/api/products/main/by-category', { next: { revalidate: 600 } });
  } catch (e) {
    console.error(e);
    return {};
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    return await fetchProductApi('/api/categories', { next: { revalidate: 300 } });
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getBanners(): Promise<Banner[]> {
  // In a real scenario, fetch from the banner API, but since this is a Mock API we will return the mock directly 
  // or fetch from an absolute URL if NEXT_PUBLIC_SITE_URL is available.
  return [
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
}

export default async function Home() {
  const [bestProducts, newProducts, productsByCategory, categories, banners] = await Promise.all([
    getBestProducts(),
    getNewProducts(),
    getProductsByCategory(),
    getCategories(),
    getBanners()
  ]);

  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  const renderProductList = (products: ProductSummary[]) => {
    if (products.length === 0) {
      return <div style={{ padding: "var(--space-4)", color: "var(--color-text-muted)" }}>상품이 없습니다.</div>;
    }
    
    return (
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
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      {/* 신뢰 안내 바 */}
      <div className="trust-bar">
        <div className="container trust-bar-items">
          {TRUST_POINTS.map((t) => (
            <span key={t} className="trust-bar-item">
              ✓ {t}
            </span>
          ))}
        </div>
      </div>

      {/* 배너 영역 */}
      {banners.length > 0 && (
        <div className="container" style={{ marginBlock: "var(--space-6)" }}>
          <div className="card blueprint elev-md hero" style={{ background: banners[0].bgColor }}>
            <BlueprintCorners />
            <div className="hero-title">{banners[0].title}</div>
            <div className="hero-sub">{banners[0].subtitle}</div>
            {banners[0].imageUrl && (
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", opacity: 0.2 }}>
                <Image src={banners[0].imageUrl} alt="banner" fill style={{ objectFit: "cover" }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 상품 그리드 */}
      <main className="container" style={{ paddingBottom: 60 }}>
        <section style={{ marginBottom: "var(--space-8)" }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: "var(--space-4)" }}>베스트 상품</h2>
          {renderProductList(bestProducts)}
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: "var(--space-4)" }}>신상품</h2>
          {renderProductList(newProducts)}
        </section>

        {/* 카테고리별 상품 */}
        {Object.entries(productsByCategory).map(([categoryIdStr, products]) => {
          const categoryId = parseInt(categoryIdStr, 10);
          const categoryName = categoryMap.get(categoryId) || `카테고리 ${categoryId}`;
          if (products.length === 0) return null;

          return (
            <section key={categoryId} style={{ marginTop: "var(--space-8)" }}>
              <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: "var(--space-4)" }}>
                {categoryName}
              </h2>
              {renderProductList(products)}
            </section>
          );
        })}
      </main>
    </div>
  );
}
