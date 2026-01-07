import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration (Next.js 16+ default)
  turbopack: {},
  
  // Webpack configuration for fallback/production builds
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client');
    }
    
    // Handle Prisma WebAssembly files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    
    return config;
  },
  
  // Experimental features for better Prisma support
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-pg'],
  },
};

export default nextConfig;
