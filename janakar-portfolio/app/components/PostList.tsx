import Link from 'next/link'
import type { Post } from '@/content'
import { yearsFor } from '@/content'

/** benji.org-style year-grouped post list. */
export default function PostList({
  id,
  title,
  posts,
}: {
  id: string
  title: string
  posts: Post[]
}) {
  if (posts.length === 0) return null

  const years = yearsFor(posts)

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="post-list mt-12 max-w-xl scroll-mt-8 font-inter">
      <h2 id={`${id}-heading`} className="post-list-title">
        {title}
      </h2>
      <ul>
        {years.map((year) => (
          <li key={year}>
            <ul>
              {posts
                .filter((p) => p.listDate.endsWith(year))
                .map((post) => (
                  <li key={post.slug}>
                    <Link href={`/${post.slug}`}>
                      <span className="post-list-name text-primary">{post.title}</span>
                      <time>
                        <span>{post.listDate.split(' / ')[0]}</span>
                        <span>/</span>
                        <span>{year}</span>
                      </time>
                    </Link>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
