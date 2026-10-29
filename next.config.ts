import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Cloudinary's free tier serves the portrait; Vercel Image Optimization is not used.
    loader: 'custom',
    loaderFile: './lib/cloudinary-loader.ts',
  },
}

export default nextConfig
