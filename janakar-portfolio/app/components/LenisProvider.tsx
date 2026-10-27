'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/** Enables smooth inertial scrolling across all pages via Lenis. */
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      infinite: false,
      gestureOrientation: 'vertical',
      syncTouch: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
