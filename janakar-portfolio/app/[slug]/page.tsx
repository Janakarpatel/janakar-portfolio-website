import { notFound } from 'next/navigation'
import Footer from '@/app/components/Footer'
import Article from '@/app/components/Article'
import { getAllPosts, getPost } from '@/content'

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Not found' }
  return {
    title: `${post.title} | Janakar`,
    description: post.summary,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <main className="w-full h-max z-10">
        <Article post={post} />
      </main>
      <Footer />
    </div>
  )
}
