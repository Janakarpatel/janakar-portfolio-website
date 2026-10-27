import Link from 'next/link'
import Footer from '@/app/components/Footer'

const h2 = 'm-0 pt-4 text-[15px] font-crimson font-normal leading-normal tracking-[-0.13px] text-balance'
const link = 'text-primary underline underline-offset-2 hover:text-[var(--color-hover-blue)]'

export default function Contact() {
  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <main className="w-full h-max z-10">
        {/* same column and type as the project pages (benji.org article spec) */}
        <div className="max-w-[36.375rem] mx-auto pt-20 px-4 pb-10 font-inter text-primary max-[768px]:pt-8 max-[768px]:px-6">
          <nav aria-label="Back" className="fixed top-20 left-20 z-10 font-inter font-[460] max-[1080px]:static max-[1080px]:pb-8">
            <Link
              href="/"
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
          </nav>

          <article className="max-w-[70ch] text-[14px] font-[460] leading-5 tracking-[-0.09px]">
            <header className="flex flex-col gap-1 pb-2">
              <h1 className="m-0 text-[14px] font-medium leading-5 tracking-[-0.09px]">Get in Touch</h1>
              <p className="m-0 text-[var(--muted-color)]">Let&apos;s collaborate and build something great</p>
            </header>

            <p className="m-0 pt-4">
              I&apos;m always interested in learning about new opportunities and technical challenges.
              Whether you want to discuss a project, explore a collaboration, or just have an
              interesting conversation, I&apos;d love to hear from you.
            </p>

            <section aria-labelledby="contact-email">
              <h2 id="contact-email" className={h2}>
                Email
              </h2>
              <p className="m-0 pt-4">
                The best way to reach me is via email. I try to respond to every email. However, I tend
                to procrastinate on long/non-urgent emails, and sometimes forget to respond altogether.
                If I haven&apos;t replied in a week, feel free to follow up.{' '}
                <a href="mailto:contact.janakarpatel@gmail.com" className={link}>
                  contact.janakarpatel@gmail.com
                </a>
              </p>
            </section>

            <section aria-labelledby="contact-social">
              <h2 id="contact-social" className={h2}>
                Social Links
              </h2>
              <p className="m-0 pt-4">
                I use social media, but don&apos;t spend a lot of time on it. The services I use include:
              </p>
              <ul className="m-0 pt-2 pl-5 list-disc flex flex-col gap-2">
                <li>
                  <a href="https://x.com/janakarpatel" target="_blank" rel="noopener noreferrer" className={link}>
                    X(Twitter)
                  </a>
                  : I read DMs, but I find its inbox hard to use so please don&apos;t use it to reach me.
                </li>
                <li>
                  <a href="https://linkedin.com/in/janakarpatel" target="_blank" rel="noopener noreferrer" className={link}>
                    LinkedIn
                  </a>
                  : I read LinkedIn messages but I prefer emails.
                </li>
                <li>
                  <a href="https://www.youtube.com/@prjack935" target="_blank" rel="noopener noreferrer" className={link}>
                    Youtube
                  </a>
                  : I&apos;m camera-shy, so I haven&apos;t done a lot of videos. But I want to change that.
                </li>
                <li>
                  <a href="https://www.instagram.com/its.jnkr" target="_blank" rel="noopener noreferrer" className={link}>
                    Instagram
                  </a>
                  : If I don&apos;t follow you on Instagram, your message goes to a separate folder that I
                  don&apos;t check.
                </li>
              </ul>
              <p className="m-0 pt-4">
                <strong className="font-semibold">tl;dr</strong>: follow me on social media but reach me via email.
              </p>
            </section>

            <section aria-labelledby="contact-scheduling">
              <h2 id="contact-scheduling" className={h2}>
                Scheduling
              </h2>
              <p className="m-0 pt-4">
                Please send a calendar invite for any scheduled plans if I haven&apos;t already. I may
                forget otherwise.
              </p>
            </section>

            <section aria-labelledby="contact-conclusion">
              <h2 id="contact-conclusion" className={h2}>
                Conclusion
              </h2>
              <p className="m-0 pt-4">
                When it comes to communication, I&apos;m systematic but not inflexible. This post is a
                reference to avoid misunderstandings, not a rule. Some of the best memories I&apos;ve had
                are from spontaneous decisions. I&apos;d love to have more free spirits and rulebreakers
                in my life.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
