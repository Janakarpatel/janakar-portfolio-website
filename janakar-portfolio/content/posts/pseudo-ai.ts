import type { Post } from '../types'

const post: Post = {
  slug: 'pseudo-ai',
  kind: 'project',
  title: 'Pseudo AI',
  date: 'June 2023',
  listDate: '01/06 / 2023',
  summary:
    'A small Next.js site that turns code into pseudo-code. Built for students who were rewriting by hand.',
  sections: [
    {
      id: 'the-rewrite-tax',
      title: 'The rewrite tax',
      nav: 'Rewrite tax',
      blocks: [
        {
          type: 'p',
          text: 'Assignments ask for the algorithm in prose. Students paste code into a doc and translate it line by line. That takes a long time.^[1]',
        },
      ],
    },
    {
      id: 'the-site',
      title: 'The site',
      blocks: [
        {
          type: 'p',
          text: 'Next.js on the front, OpenAI for the conversion, Figma prototypes first. Deployed on Vercel.',
        },
      ],
    },
    {
      id: 'after',
      title: 'After',
      blocks: [
        {
          type: 'p',
          text: 'For the students who used it, documentation time dropped about 35%. Built May to June 2023.',
        },
      ],
    },
  ],
  footnotes: [
    {
      id: '1',
      text: 'Not saying pseudo-code replaces understanding. Just that typing it twice should not be the hard part.',
    },
  ],
}

export default post
