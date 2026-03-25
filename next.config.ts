import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "standalone",
  ...(!isProd && process.env.PROXY_API_URL && {
    async rewrites() {
      return {
        beforeFiles: [
          {
            source: "/api/:path*",
            destination: `${process.env.PROXY_API_URL}/api/:path*`,
          },
        ],
      };
    },
  }),
};

export default nextConfig;
