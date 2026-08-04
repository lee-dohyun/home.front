"use client";

import { useEffect, useState } from "react";
import { Tag, Input, BlueprintCorners, Logo } from "@posselect/ui";

const profileUrl = "/profile";

const CATEGORIES = [
  "베스트",
  "로켓배송",
  "신선식품",
  "가전디지털",
  "패션",
  "뷰티",
  "홈리빙",
  "스포츠/레저",
  "도서",
];

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

const CUSTOMER_BASE_URL =
  process.env.NEXT_PUBLIC_CUSTOMER_BASE_URL ?? "https://customer.posselect.com";
const HOME_BASE_URL = process.env.NEXT_PUBLIC_HOME_BASE_URL ?? "https://home.posselect.com";

export default function Home() {
  const loginUrl = `${CUSTOMER_BASE_URL}/login?redirect_uri=${HOME_BASE_URL}/`;
  const signupUrl = `${CUSTOMER_BASE_URL}/signup?redirect_uri=${HOME_BASE_URL}/`;

  const [name, setName] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setName(data?.name ?? null))
      .catch(() => setName(null))
      .finally(() => setChecked(true));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.reload();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      {/* 신뢰 안내 바 */}
      <div
        style={{
          background: "var(--color-accent-900)",
          color: "var(--color-neutral-100)",
          fontSize: 12,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "6px 24px",
            display: "flex",
            gap: 20,
            overflowX: "auto",
          }}
        >
          {TRUST_POINTS.map((t) => (
            <span key={t} style={{ whiteSpace: "nowrap" }}>
              ✓ {t}
            </span>
          ))}
        </div>
      </div>

      {/* 헤더 */}
      <header style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-divider)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Logo size={22} />
          <div style={{ flex: 1, maxWidth: 560 }}>
            <Input placeholder="검색어를 입력하세요 (준비 중)" disabled />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
            {checked && name ? (
              <>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{name}님, 환영합니다.</span>
                <a href={profileUrl} className="btn btn-secondary blueprint">
                  <BlueprintCorners />
                  나의 정보
                </a>
                <button className="btn btn-ghost" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              checked && (
                <>
                  <a href={loginUrl} className="btn btn-primary blueprint">
                    <BlueprintCorners />
                    로그인
                  </a>
                  <a href={signupUrl} className="btn btn-secondary blueprint">
                    <BlueprintCorners />
                    회원가입
                  </a>
                </>
              )
            )}
          </div>
        </div>
        {/* 카테고리 (동작 안 함) */}
        <nav
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px 12px",
            display: "flex",
            gap: 8,
            overflowX: "auto",
          }}
        >
          {CATEGORIES.map((c) => (
            <Tag key={c} variant="outline">
              {c}
            </Tag>
          ))}
        </nav>
      </header>

      {/* 배너 (하드코딩, 동작 안 함) */}
      <div
        style={{
          maxWidth: 1200,
          margin: "20px auto",
          padding: "0 24px",
        }}
      >
        <div
          className="card blueprint elev-md"
          style={{
            height: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 40px",
            background: "var(--color-accent)",
            color: "#fff",
          }}
        >
          <BlueprintCorners />
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 24 }}>
            검증된 상품만 엄선했습니다
          </div>
          <div style={{ fontSize: 14, opacity: 0.85, marginTop: 8 }}>
            준비 중인 페이지입니다 — 상품/배너는 추후 실제 데이터로 교체 예정
          </div>
        </div>
      </div>

      {/* 상품 그리드 (하드코딩, 클릭 동작 없음) */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: 18,
            marginBottom: 16,
            color: "var(--color-text)",
          }}
        >
          지금 뜨는 상품
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {PRODUCTS.map((p) => (
            <div key={p.title} className="card blueprint elev-sm">
              <BlueprintCorners />
              <div
                style={{
                  height: 160,
                  background: "var(--color-neutral-200)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-neutral-600)",
                  fontSize: 13,
                }}
              >
                이미지 준비 중
              </div>
              <div style={{ padding: 12 }}>
                <div className="card-kicker">{p.tag}</div>
                <div className="card-title" style={{ fontSize: 14 }}>
                  {p.title}
                </div>
                <div className="card-meta" style={{ fontSize: 16, fontWeight: 800 }}>
                  {p.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--color-divider)",
          background: "var(--color-surface)",
          padding: "32px 24px",
          fontSize: 12,
          color: "var(--color-neutral-700)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 8 }}>
            <Logo size={15} />
          </div>
          <div style={{ lineHeight: 1.8 }}>
            상호: PosSelect · 고객센터: 준비 중 (평일 09:00~18:00) · 사업자정보: 준비 중
          </div>
          <div style={{ marginTop: 12, color: "var(--color-neutral-500)" }}>
            © PosSelect — 데모 페이지, 상품 정보는 실제와 무관합니다.
          </div>
        </div>
      </footer>
    </div>
  );
}
