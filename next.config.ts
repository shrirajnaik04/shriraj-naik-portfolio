import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dfvyqtli8/image/upload/**',
      },
    ],
  },
}

export default nextConfig
