import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['image.jancodelookup.com'],
  },
};

export default nextConfig;
