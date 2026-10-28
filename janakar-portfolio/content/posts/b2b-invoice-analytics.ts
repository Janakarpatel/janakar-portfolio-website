import type { Post } from '../types'

const post: Post = {
  slug: 'b2b-invoice-analytics',
  kind: 'project',
  title: 'B2B Invoice & Analytics',
  date: 'June 2026 – Present',
  listDate: '01/06 / 2026',
  summary:
    'A production web app for a fasteners manufacturer — invoices, clients, payments, and a little analytics, instead of Word and Excel.',
  sections: [
    {
      id: 'word-and-excel',
      title: 'Word & Excel',
      nav: 'Word & Excel',
      blocks: [
        {
          type: 'p',
          text: 'Billing lived in Word docs and Excel sheets. One invoice took about twenty minutes. Clients, payments, and reporting were three different files that never quite agreed.',
        },
      ],
    },
    {
      id: 'one-app',
      title: 'One app',
      blocks: [
        {
          type: 'p',
          text: 'I built a single web app for invoicing, client management, payment tracking, and the numbers they actually look at. Same job, fewer clicks — under five minutes per invoice once it was live.',
        },
      ],
    },
    {
      id: 'in-production',
      title: 'In production',
      blocks: [
        {
          type: 'p',
          text: 'Running for the manufacturing client since June 2026. Still iterating with them as freelance work.',
        },
      ],
    },
  ],
}

export default post
