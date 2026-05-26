/** @type {import('next').NextConfig} */
const nextConfig = {
  // 안전 머리띠(보안 헤더): 브라우저에게 "항상 안전 연결(https)로만 와라"
  async headers() {
    return [
      {
        source: "/:path*", // 사이트의 모든 페이지에 적용
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
