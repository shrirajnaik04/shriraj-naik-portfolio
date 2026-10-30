import type { NextConfig } from 'next'
import { redirects, securityHeaders } from './lib/http'

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
  async headers() {
    // Production builds only: the dev server's hot reload needs things the policy forbids.
    if (process.env.NODE_ENV !== 'production') return []
    return [{ source: '/:path*', headers: securityHeaders({ vercel: process.env.VERCEL === '1' }) }]
  },
  async redirects() {
    return redirects()
  },
}

export default nextConfig
