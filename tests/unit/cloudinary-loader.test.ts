import { describe, expect, test } from 'vitest'
import cloudinaryLoader from '@/lib/cloudinary-loader'

describe('cloudinary loader', () => {
  test('builds a face-cropped 4:5 URL at the requested width', () => {
    expect(cloudinaryLoader({ src: 'v1777649066/profile.jpg', width: 640 })).toBe(
      'https://res.cloudinary.com/dfvyqtli8/image/upload/f_auto,q_auto,c_fill,g_face,ar_4:5,w_640/v1777649066/profile.jpg',
    )
  })

  test('passes an explicit quality through', () => {
    expect(cloudinaryLoader({ src: 'v1777649066/profile.jpg', width: 320, quality: 70 })).toContain('q_70,')
  })

  test('strips a leading slash from the source', () => {
    expect(cloudinaryLoader({ src: '/v1/a.jpg', width: 100 })).toMatch(/,w_100\/v1\/a\.jpg$/)
  })
})
