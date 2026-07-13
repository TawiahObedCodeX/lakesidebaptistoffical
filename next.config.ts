import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
 allowedDevOrigins: [
  "localhost",
  "127.0.0.1",
  "172.29.16.1",
  "30.30.100.163",
],
  reactStrictMode: true,
  // Ensure no rewrites that capture /api/*
  async rewrites() {
    return [];
  },
};

export default nextConfig;