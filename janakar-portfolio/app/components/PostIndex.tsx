'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Post } from '@/content'

/** Left index bar: back home + in-page section TOC (benji.org-style). */
export default function PostIndex({ post }: { post: Post }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const ids = post.sections.map((s) => s.id)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [post.sections])

  return (
    <aside className="fixed top-20 left-20 z-10 font-inter font-[460] max-[1080px]:static max-[1080px]:pb-8">
      <div>
        <Link
          href="/#projects"
          className="flex items-center gap-1 py-1 w-fit text-[14px] leading-5 tracking-[-0.09px] text-[var(--muted-color)] hover:text-[var(--muted-hover-color)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M5.5 4L1.5 8M1.5 8L5.5 12M1.5 8H10C11.3807 8 12.5 6.88071 12.5 5.5V5.5C12.5 4.11929 11.3807 3 10 3H8.5"
              stroke="currentColor"
            />
          </svg>
          Index
        </Link>

        <nav aria-label="On this page" className="pt-[1.875rem] max-w-40 max-[1080px]:hidden">
          <ul className="m-0 p-0 list-none flex flex-col gap-2">
            {post.sections.map((section) => {
              const active = activeId === section.id
              return (
                <li key={section.id} className="m-0">
                  <a
                    href={`#${section.id}`}
                    className={`block text-[13px] leading-[1.2] tracking-[-0.04px] no-underline transition-colors ${
                      active
                        ? 'text-[var(--toc-active-color)]'
                        : 'text-[var(--toc-color)] hover:text-[var(--toc-active-color)]'
                    }`}
                  >
                    {section.nav ?? section.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
