import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
   remotePatterns: [
    { protocol: 'https', hostname: 'upload.wikimedia.org' },
  ],


  },
  // Active le mode standalone pour Docker
  output: 'standalone',
};

export default nextConfig;
