'use client'

import Link from 'next/link'
import Footer from '@/app/components/Footer'
import AmbientSound from '@/app/components/AmbientSound'
import PostList from '@/app/components/PostList'
import { getPostsByKind } from '@/content'

const projects = getPostsByKind('project')
const writings = getPostsByKind('writing')
const blogs = getPostsByKind('blog')

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <main className="w-full h-max z-10">
        {/* benji.org page column: 36.375rem wide, 5rem / 1rem padding (2rem / 1.5rem on mobile) */}
        <div className="max-w-[36.375rem] mx-auto pt-20 px-4 max-[768px]:pt-8 max-[768px]:px-6">
          <header className="m-0 flex flex-col items-start max-[768px]:w-full max-[480px]:w-full">
            <div className="w-full flex flex-col gap-0">
              <div className="flex items-center justify-between gap-4">
                <h1 className="m-0 p-0 flex items-start gap-2 text-[16px] font-haskoy font-semibold tracking-[--letter-spacing-custom-tighter] leading-none text-primary max-[480px]:text-[2rem]">
                  <span>Janakar Patel</span>
                  <span className="font-normal tracking-normal leading-none">
                    (<span lang="gu" className="font-rasa text-[18px]">જનકાર પટેલ</span>)
                  </span>
                </h1>
                <AmbientSound />
              </div>
              <p className="font-inter text-[13px] font-[460] tracking-[-0.09px] leading-5 text-[var(--muted-color)]">
                Data, AI/ML Software, Hardware + *Art &amp; Design
              </p>
            </div>
            <nav
              aria-label="Social links"
              className="mt-6 flex gap-4"
            >
              <a
                href="https://x.com/janakarpatel"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-link text-[14px] font-medium tracking-[-0.09px] cursor-pointer pointer-events-auto relative z-2 max-[480px]:text-base"
              >
                X
              </a>
              <a
                href="https://github.com/janakarpatel"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-link text-[14px] tracking-[-0.09px] cursor-pointer pointer-events-auto relative z-2 max-[480px]:text-base font-medium"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/janakarpatel/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-link text-[14px] font-medium tracking-[-0.09px] cursor-pointer pointer-events-auto relative z-2 max-[480px]:text-base"
              >
                LinkedIn
              </a>
              <a
                href="mailto:contact.janakarpatel@gmail.com"
                className="hover-link text-[14px] font-medium tracking-[-0.09px] cursor-pointer pointer-events-auto relative z-2 max-[480px]:text-base"
              >
                Email
              </a>
            </nav>
          </header>

          <section
            aria-label="About"
            className="max-w-xl text-[14px] font-inter font-[460] tracking-[-0.09px] text-primary leading-5 max-[480px]:max-w-full"
          >
            <p className="m-0 mt-6">
              I&apos;m an engineer and a self-taught artist curious about software and hardware,
              currently based in Ahmedabad City and working on Data and AI at{' '}
              <a
                href="https://www.tcs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="basic-link cursor-pointer"
              >
                TCS
              </a>
              . Previously, I was an engineering student at{' '}
              <a
                href="https://www.pdpu.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="basic-link cursor-pointer"
              >
                Pandit Deendayal Energy University
              </a>{' '}
              in Gandhinagar.
            </p>
            <p className="m-0 mt-4">
              I care about intentional thinking, design, and engineering. I enjoy dreaming up
              ambitious toys that solve complex problems in creative ways. I want to create
              beautiful things that I am proud of.
            </p>
            <p className="m-0 mt-4">
              I&apos;ve recently been working on and thinking about machine understandings research.
            </p>
          </section>

          <p className="m-0 mt-4 max-w-xl text-[14px] font-inter font-[460] tracking-[-0.09px] text-primary leading-5 max-[480px]:max-w-full">
            If my work resonates with you, feel free to reach out anytime at{' '}
            <Link href="/contact" className="basic-link cursor-pointer">
              click here.
            </Link>
          </p>

          <PostList id="projects" title="Projects" posts={projects} />
          <PostList id="writing" title="Writing" posts={writings} />
          <PostList id="blog" title="Blog" posts={blogs} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
