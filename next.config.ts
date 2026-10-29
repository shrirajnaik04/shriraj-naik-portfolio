import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typescript: {
    // The app build type-checks app code only; `pnpm typecheck` still checks tests and scripts.
    tsconfigPath: './tsconfig.build.json',
  },
  images: {
    // Cloudinary's free tier serves the portrait; Vercel Image Optimization is not used.
    loader: 'custom',
    loaderFile: './lib/cloudinary-loader.ts',
  },
}

export default nextConfig
