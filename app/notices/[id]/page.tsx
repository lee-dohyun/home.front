"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getNoticeById } from "../data";

export default function NoticeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const notice = Number.isFinite(id) ? getNoticeById(id) : undefined;

  if (!notice) {
    return (
      <main
        style={{
          minHeight: "60vh",
          background: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
          <p className="text-muted" style={{ fontSize: 14, marginBottom: 24 }}>
            공지사항을 찾을 수 없습니다.
          </p>
          <Link href="/notices">목록으로 돌아가기</Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "60vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <span className="tag" style={{ fontSize: 11, marginBottom: 12, display: "inline-flex" }}>
          {notice.category}
        </span>
        <h1 style={{ marginBottom: 8 }}>{notice.title}</h1>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 32 }}>
          {notice.date}
        </p>

        <p style={{ whiteSpace: "pre-line", fontSize: 14, opacity: 0.88, lineHeight: 1.7 }}>
          {notice.body}
        </p>

        <hr className="hr" style={{ margin: "40px 0" }} />

        <Link href="/notices">목록으로 돌아가기</Link>
      </div>
    </main>
  );
}
