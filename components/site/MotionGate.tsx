'use client'

import { useEffect } from 'react'

/**
 * The drawings' endless motion (beads along the connectors, marching guardrails) runs only while a
 * drawing is on screen: this marks each .figure-plate with data-inview, and CSS pauses the rest.
 * Background tabs don't render, so they pause too. Reduced motion turns it off in CSS.
 */
export function MotionGate() {
  useEffect(() => {
    const plates = document.querySelectorAll<HTMLElement>('.figure-plate')
    if (!plates.length) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.toggleAttribute('data-inview', entry.isIntersecting)
    })
    for (const plate of plates) observer.observe(plate)
    return () => observer.disconnect()
  }, [])
  return null
}
