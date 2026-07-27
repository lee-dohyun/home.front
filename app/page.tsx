"use client";

import { useEffect, useState } from "react";

const profileUrl = "https://customer.leedohyun.com/profile?redirect_uri=https://home.leedohyun.com/";

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
  { title: "무선 이어폰 Pro", price: "89,900원", tag: "로켓배송", color: "#4f46e5" },
  { title: "접이식 스탠딩 책상", price: "129,000원", tag: "로켓배송", color: "#0ea5e9" },
  { title: "유기농 원두 1kg", price: "18,500원", tag: "신선식품", color: "#84603f" },
  { title: "게이밍 모니터 27인치", price: "259,000원", tag: "가전디지털", color: "#111827" },
  { title: "봄 신상 니트", price: "34,900원", tag: "패션", color: "#be185d" },
  { title: "수분 진정 크림", price: "22,000원", tag: "뷰티", color: "#f472b6" },
  { title: "극세사 이불 세트", price: "45,000원", tag: "홈리빙", color: "#65a30d" },
  { title: "요가 매트", price: "15,900원", tag: "스포츠/레저", color: "#ea580c" },
  { title: "베스트셀러 소설", price: "13,500원", tag: "도서", color: "#7c3aed" },
  { title: "무선 청소기", price: "189,000원", tag: "로켓배송", color: "#0891b2" },
];

export default function Home() {
  const loginUrl =
    "https://customer.leedohyun.com/login?redirect_uri=https://home.leedohyun.com/";
  const signupUrl =
    "https://customer.leedohyun.com/signup?redirect_uri=https://home.leedohyun.com/";

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
    <div style={{ minHeight: "100vh", background: "#f7f7f8", color: "#111" }}>
      {/* 헤더 */}
      <header style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
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
          <span style={{ fontSize: 22, fontWeight: 800, color: "#e11d48" }}>
            DH Store
          </span>
          <div style={{ flex: 1, maxWidth: 560 }}>
            <input
              placeholder="검색어를 입력하세요 (준비 중)"
              disabled
              style={{
                width: "100%",
                padding: "10px 16px",
                border: "2px solid #e11d48",
                borderRadius: 4,
                fontSize: 14,
                background: "#fafafa",
                color: "#999",
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
                    borderRadius: 20,
                    border: "1px solid #111",
                    color: "#111",
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
                    borderRadius: 20,
                    border: "1px solid #999",
                    color: "#666",
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
                      borderRadius: 20,
                      background: "#111",
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
                      borderRadius: 20,
                      border: "1px solid #111",
                      color: "#111",
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
              style={{ fontSize: 13, color: "#333", whiteSpace: "nowrap", cursor: "default" }}
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
            background: "linear-gradient(135deg, #e11d48, #4f46e5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 40px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800 }}>봄맞이 특가 이벤트</div>
          <div style={{ fontSize: 14, opacity: 0.9, marginTop: 8 }}>
            준비 중인 페이지입니다 — 상품/배너는 추후 실제 데이터로 교체 예정
          </div>
        </div>
      </div>

      {/* 상품 그리드 (하드코딩, 클릭 동작 없음) */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>지금 뜨는 상품</h2>
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
                border: "1px solid #eee",
                borderRadius: 8,
                overflow: "hidden",
                cursor: "default",
              }}
            >
              <div
                style={{
                  height: 160,
                  background: p.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 13,
                  opacity: 0.85,
                }}
              >
                이미지 준비 중
              </div>
              <div style={{ padding: 12 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#e11d48",
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {p.tag}
                </div>
                <div style={{ fontSize: 14, marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid #eee",
          padding: "24px",
          textAlign: "center",
          fontSize: 12,
          color: "#999",
        }}
      >
        © DH Store — 데모 페이지, 상품 정보는 실제와 무관합니다.
      </footer>
    </div>
  );
}
