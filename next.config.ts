import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.0.130'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      }
    ],
  }
  /* config options here */
};

export default nextConfig;
