/** One content unit — project, writing, or blog. Same shape as benji.org posts. */
export type PostKind = 'project' | 'writing' | 'blog'

export type PostBlock =
  | { type: 'p'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

export type PostSection = {
  id: string
  /** In-page heading — unique per post, like benji’s TOC */
  title: string
  /** Optional shorter label for the left nav; defaults to title */
  nav?: string
  blocks: PostBlock[]
}

export type PostFootnote = {
  id: string
  text: string
}

export type Post = {
  slug: string
  kind: PostKind
  title: string
  /** Display date, e.g. "27 August, 2023" */
  date: string
  /** Compact list date, e.g. "27/08 / 2023" */
  listDate: string
  summary: string
  sections: PostSection[]
  /** Small asides at the bottom — benji-style footnotes */
  footnotes?: PostFootnote[]
}
