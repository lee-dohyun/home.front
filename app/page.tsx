import { BlueprintCorners } from "@posselect/ui";

const PRODUCTS = [
  { title: "무선 이어폰 Pro", price: "89,900원", tag: "로켓배송" },
  { title: "접이식 스탠딩 책상", price: "129,000원", tag: "로켓배송" },
  { title: "유기농 원두 1kg", price: "18,500원", tag: "신선식품" },
  { title: "게이밍 모니터 27인치", price: "259,000원", tag: "가전디지털" },
  { title: "봄 신상 니트", price: "34,900원", tag: "패션" },
  { title: "수분 진정 크림", price: "22,000원", tag: "뷰티" },
  { title: "극세사 이불 세트", price: "45,000원", tag: "홈리빙" },
  { title: "요가 매트", price: "15,900원", tag: "스포츠/레저" },
  { title: "베스트셀러 소설", price: "13,500원", tag: "도서" },
  { title: "무선 청소기", price: "189,000원", tag: "로켓배송" },
];

const TRUST_POINTS = [
  "안전결제 인증 완료",
  "품질 검수를 통과한 상품만 판매",
  "고객센터 평일 09:00~18:00 운영",
];

export default function Home() {
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

      {/* 배너 (하드코딩, 동작 안 함) */}
      <div className="container" style={{ marginBlock: "var(--space-6)" }}>
        <div className="card blueprint elev-md hero">
          <BlueprintCorners />
          <div className="hero-title">검증된 상품만 엄선했습니다</div>
          <div className="hero-sub">
            준비 중인 페이지입니다 — 상품/배너는 추후 실제 데이터로 교체 예정
          </div>
        </div>
      </div>

      {/* 상품 그리드 (하드코딩, 클릭 동작 없음) */}
      <main className="container" style={{ paddingBottom: 60 }}>
        <h2 style={{ fontSize: 18, marginBottom: "var(--space-4)" }}>지금 뜨는 상품</h2>
        <div className="product-grid">
          {PRODUCTS.map((p) => (
            <div key={p.title} className="card blueprint elev-sm">
              <BlueprintCorners />
              <div className="product-card-media">이미지 준비 중</div>
              <div className="product-card-body">
                <div className="card-kicker">{p.tag}</div>
                <div className="card-title" style={{ fontSize: 14 }}>
                  {p.title}
                </div>
                <div className="card-meta product-card-price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
