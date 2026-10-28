import { redirect } from 'next/navigation'
import { getAllPosts, getPost } from '@/content'

/** Old /projects/:slug URLs → flat /:slug (benji-style). */
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export default async function LegacyProjectRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!getPost(slug)) redirect('/#projects')
  redirect(`/${slug}`)
}
