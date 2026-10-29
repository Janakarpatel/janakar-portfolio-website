import Image from 'next/image'
import type { Post } from '@/content'
import ProjectRichText from '@/app/components/ProjectRichText'
import PostIndex from '@/app/components/PostIndex'
import CodeBlock from '@/app/components/CodeBlock'

/** Shared article layout for projects, writings, and blogs (benji.org column). */
export default function Article({ post }: { post: Post }) {
  return (
    <div className="max-w-[36.375rem] mx-auto pt-20 px-4 pb-10 font-inter text-primary max-[768px]:pt-8 max-[768px]:px-6">
      <PostIndex post={post} />

      <article className="article-prose max-w-[70ch] text-[14px] font-[460] leading-5 tracking-[-0.09px]">
        <header>
          <h1>{post.title}</h1>
          <time>{post.date}</time>
        </header>

        <p>
          <ProjectRichText text={post.summary} />
        </p>

        {post.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            <h2>{section.title}</h2>
            {section.blocks.map((block, i) => {
              if (block.type === 'p') {
                return (
                  <p key={i}>
                    <ProjectRichText text={block.text} />
                  </p>
                )
              }
              if (block.type === 'code') {
                return (
                  <CodeBlock
                    key={i}
                    code={block.code}
                    language={block.language}
                    caption={block.caption}
                  />
                )
              }
              return (
                <figure key={i} className="project-figure">
                  <div className="project-figure-frame">
                    <Image
                      src={block.src}
                      alt={block.alt}
                      width={1160}
                      height={720}
                      className="block w-full h-auto"
                      sizes="(max-width: 36.375rem) 100vw, 36.375rem"
                    />
                  </div>
                  {block.caption ? <figcaption>{block.caption}</figcaption> : null}
                </figure>
              )
            })}
          </section>
        ))}

        {post.footnotes && post.footnotes.length > 0 ? (
          <section className="footnotes" data-footnotes>
            <h2 id="footnote-label" className="sr-only">
              Footnotes
            </h2>
            <ol>
              {post.footnotes.map((fn) => (
                <li key={fn.id} id={`fn-${fn.id}`}>
                  <ProjectRichText text={fn.text} />{' '}
                  <a href={`#fnref-${fn.id}`} className="basic-link" aria-label={`Back to reference ${fn.id}`}>
                    ↩
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </article>
    </div>
  )
}
