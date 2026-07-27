"use client";

import { useEffect, useState } from "react";

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

  return (
    <div className="grid min-h-screen items-center justify-items-center p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold">leedohyun.com</h1>
        {checked && name ? (
          <p className="text-lg">{name}님, 환영합니다.</p>
        ) : (
          checked && (
            <div className="flex gap-3">
              <a
                href={loginUrl}
                className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                로그인
              </a>
              <a
                href={signupUrl}
                className="rounded-full border border-foreground px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                회원가입
              </a>
            </div>
          )
        )}
      </main>
    </div>
  );
}
