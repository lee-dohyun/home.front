"use client";

import { useEffect, useState } from "react";

const profileUrl = "/profile";

const NAVY = "#0f172a";
const ACCENT = "#2563eb";

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
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: NAVY }}>
      {/* 신뢰 안내 바 */}
      <div
        style={{
          background: NAVY,
          color: "#e2e8f0",
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
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
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
          <span style={{ fontSize: 22, fontWeight: 800, color: NAVY, letterSpacing: -0.5 }}>
            POSSELECT
          </span>
          <div style={{ flex: 1, maxWidth: 560 }}>
            <input
              placeholder="검색어를 입력하세요 (준비 중)"
              disabled
              style={{
                width: "100%",
                padding: "10px 16px",
                border: `1.5px solid ${ACCENT}`,
                borderRadius: 6,
                fontSize: 14,
                background: "#f8fafc",
                color: "#94a3b8",
              }}
            />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
            {checked && name ? (
              <>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{name}님, 환영합니다.</span>
                <a
                  href={profileUrl}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    border: `1px solid ${NAVY}`,
                    color: NAVY,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  나의 정보
                </a>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    color: "#64748b",
                    fontSize: 13,
                    fontWeight: 600,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              checked && (
                <>
                  <a
                    href={loginUrl}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 6,
                      background: NAVY,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    로그인
                  </a>
                  <a
                    href={signupUrl}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 6,
                      border: `1px solid ${NAVY}`,
                      color: NAVY,
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
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
            gap: 20,
            overflowX: "auto",
          }}
        >
          {CATEGORIES.map((c) => (
            <span
              key={c}
              style={{
                fontSize: 13,
                color: "#334155",
                whiteSpace: "nowrap",
                cursor: "default",
                paddingBottom: 4,
                borderBottom: "2px solid transparent",
              }}
            >
              {c}
            </span>
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
          style={{
            height: 180,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${NAVY}, #1e3a8a)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 40px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800 }}>검증된 상품만 엄선했습니다</div>
          <div style={{ fontSize: 14, opacity: 0.85, marginTop: 8 }}>
            준비 중인 페이지입니다 — 상품/배너는 추후 실제 데이터로 교체 예정
          </div>
        </div>
      </div>

      {/* 상품 그리드 (하드코딩, 클릭 동작 없음) */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: NAVY }}>
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
            <div
              key={p.title}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                overflow: "hidden",
                cursor: "default",
                boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  height: 160,
                  background: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  fontSize: 13,
                }}
              >
                이미지 준비 중
              </div>
              <div style={{ padding: 12 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: ACCENT,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {p.tag}
                </div>
                <div style={{ fontSize: 14, marginBottom: 6, color: NAVY }}>{p.title}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          background: "#fff",
          padding: "32px 24px",
          fontSize: 12,
          color: "#64748b",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: 8 }}>
            POSSELECT
          </div>
          <div style={{ lineHeight: 1.8 }}>
            상호: POSSELECT · 고객센터: 준비 중 (평일 09:00~18:00) · 사업자정보: 준비 중
          </div>
          <div style={{ marginTop: 12, color: "#94a3b8" }}>
            © POSSELECT — 데모 페이지, 상품 정보는 실제와 무관합니다.
          </div>
        </div>
      </footer>
    </div>
  );
}
