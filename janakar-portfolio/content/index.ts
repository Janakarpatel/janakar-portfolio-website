import type { Post, PostKind } from './types'
import b2bInvoiceAnalytics from './posts/b2b-invoice-analytics'
import palmauthEdge from './posts/palmauth-edge'
import clineAi from './posts/cline-ai'
import pseudoAi from './posts/pseudo-ai'

/**
 * Registry of all posts. Add a file under content/posts/ and import it here.
 * kind: 'project' | 'writing' | 'blog' — home lists each kind separately.
 */
const posts: Post[] = [b2bInvoiceAnalytics, palmauthEdge, clineAi, pseudoAi]

export type { Post, PostKind, PostBlock, PostSection } from './types'

export function getAllPosts(): Post[] {
  return posts
}

export function getPostsByKind(kind: PostKind): Post[] {
  return posts.filter((p) => p.kind === kind)
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

/** Years for a post list, newest first when listDate is DD/MM / YYYY. */
export function yearsFor(postsList: Post[]): string[] {
  return [...new Set(postsList.map((p) => p.listDate.split(' / ')[1]))]
}
