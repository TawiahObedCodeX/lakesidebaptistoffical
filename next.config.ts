import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.20.10.2', 'localhost', '127.0.0.1'],
  reactStrictMode: true,
  // Ensure no rewrites that capture /api/*
  async rewrites() {
    return [];
  },
};

export default nextConfig;