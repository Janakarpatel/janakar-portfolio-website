'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      infinite: false,
      gestureOrientation: 'vertical',
      syncTouch: true
    })

    // Use requestAnimationFrame to continuously update the scroll
    function raf(time: number) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}