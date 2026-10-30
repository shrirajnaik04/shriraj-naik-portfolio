import type { NextConfig } from 'next'
import { redirects, securityHeaders } from './lib/http'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Development only: lets a phone on the home network (e.g. http://192.168.1.16:3000) load the dev
  // server's scripts. Next 16 answers 403 to other origins, which leaves the page without JavaScript
  // (no menu closing, no drawing motion, no autoplay). Production ignores this setting.
  allowedDevOrigins: ['192.168.*.*'],
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
