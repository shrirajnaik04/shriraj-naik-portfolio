import type { ImageLoaderProps } from 'next/image'

export const CLOUDINARY_BASE = 'https://res.cloudinary.com/dfvyqtli8/image/upload'

/**
 * Serves images through Cloudinary's free tier instead of Vercel Image Optimization:
 * modern format, automatic quality, face-centred 4:5 crop at the requested width.
 * The crop is the portrait's: it is the site's only <Image>. Before adding another image, move the
 * crop out of this global loader (next.config.ts loaderFile), or that image is cropped to 4:5 too.
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const q = quality ? `q_${quality}` : 'q_auto'
  return `${CLOUDINARY_BASE}/f_auto,${q},c_fill,g_face,ar_4:5,w_${width}/${src.replace(/^\//, '')}`
}
