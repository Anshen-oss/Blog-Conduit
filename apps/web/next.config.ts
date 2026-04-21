import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.realworld.io',
      },
    ],
  },
  // Active le mode standalone pour Docker
  output: 'standalone',
};

export default nextConfig;
