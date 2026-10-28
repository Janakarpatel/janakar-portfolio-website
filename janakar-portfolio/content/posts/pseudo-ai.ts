import type { Post } from '../types'

const post: Post = {
  slug: 'pseudo-ai',
  kind: 'project',
  title: 'Pseudo AI',
  date: 'June 2023',
  listDate: '01/06 / 2023',
  summary:
    'A small Next.js site that turns code into pseudo-code — for students who were spending more time rewriting than thinking.',
  sections: [
    {
      id: 'the-rewrite-tax',
      title: 'The rewrite tax',
      nav: 'Rewrite tax',
      blocks: [
        {
          type: 'p',
          text: 'Assignments ask for the algorithm in prose. Students paste code into a doc and slowly translate it by hand. That tax adds up.^[1]',
        },
      ],
    },
    {
      id: 'the-site',
      title: 'The site',
      blocks: [
        {
          type: 'p',
          text: 'Next.js on the front, OpenAI for the conversion, prototypes in Figma first so the flow felt obvious. Deployed on Vercel.',
        },
      ],
    },
    {
      id: 'after',
      title: 'After',
      blocks: [
        {
          type: 'p',
          text: 'For the students who used it, documentation time dropped about 35%. May–June 2023.',
        },
      ],
    },
  ],
  footnotes: [
    {
      id: '1',
      text: 'Not a claim that pseudo-code replaces understanding — only that typing it twice should not be the hard part.',
    },
  ],
}

export default post
