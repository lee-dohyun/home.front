export default function Home() {
  const loginUrl =
    "https://customer.leedohyun.com/login?redirect_uri=https://home.leedohyun.com/";

  return (
    <div className="grid min-h-screen items-center justify-items-center p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold">leedohyun.com</h1>
        <a
          href={loginUrl}
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          로그인
        </a>
      </main>
    </div>
  );
}
