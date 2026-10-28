import type { Post } from '../types'

/**
 * Copy this file, rename (drop the leading _), fill fields, then import in content/index.ts.
 * kind: 'project' | 'writing' | 'blog'
 * Images live in public/… and use paths like '/projects/my-slug/shot.png'
 * Inline links: [label](https://…)
 */
const post: Post = {
  slug: 'my-post',
  kind: 'writing',
  title: 'Title',
  date: '1 January, 2026',
  listDate: '01/01 / 2026',
  summary: 'One or two sentences — what it is, plainly.',
  sections: [
    {
      id: 'section',
      title: 'Section',
      blocks: [
        { type: 'p', text: 'Body text. Use [links](https://example.com) inline.' },
        // { type: 'image', src: '/projects/my-post/shot.png', alt: '…', caption: '…' },
      ],
    },
  ],
}

export default post
