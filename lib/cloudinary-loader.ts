import type { ImageLoaderProps } from 'next/image'

const BASE = 'https://res.cloudinary.com/dfvyqtli8/image/upload'

/**
 * Serves images through Cloudinary's free tier instead of Vercel Image Optimization:
 * modern format, automatic quality, face-centred 4:5 crop at the requested width.
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const q = quality ? `q_${quality}` : 'q_auto'
  return `${BASE}/f_auto,${q},c_fill,g_face,ar_4:5,w_${width}/${src.replace(/^\//, '')}`
}
