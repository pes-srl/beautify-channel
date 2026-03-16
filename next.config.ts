import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eufahlzjxbimyiwivoiq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/bucket-assets/**',
      },
    ],
  },
};

export default nextConfig;
