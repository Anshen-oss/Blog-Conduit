import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // autorise tous les domaines
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],

  },
  // Active le mode standalone pour Docker
  output: 'standalone',
};

export default nextConfig;
