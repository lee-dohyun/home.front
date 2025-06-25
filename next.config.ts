import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  // 외부에서 호출될 경우, 애플리케이션이 위치한 경로 기준을 명확히 설정
  basePath: "",
  assetPrefix: "/",
  // 이미지 도메인이 있다면 (예: CDN)
  images: {
    domains: ["leedohyun.com"],
  },
};

export default nextConfig;