import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POSSELECT",
  description: "검증된 상품만 엄선하는 POSSELECT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
