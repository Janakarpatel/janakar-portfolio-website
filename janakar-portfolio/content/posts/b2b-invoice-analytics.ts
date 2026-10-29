import type { Post } from '../types'

const post: Post = {
  slug: 'b2b-invoice-analytics',
  kind: 'project',
  title: 'B2B Invoice & Analytics',
  date: 'June 2026 – Present',
  listDate: '01/06 / 2026',
  summary:
    'A web app for a fasteners manufacturer: invoices, clients, payments, and light analytics. Replaces Word and Excel.',
  sections: [
    {
      id: 'word-and-excel',
      title: 'Word & Excel',
      nav: 'Word & Excel',
      blocks: [
        {
          type: 'p',
          text: 'Billing lived in Word docs and Excel sheets. One invoice took about twenty minutes. Clients, payments, and reporting sat in three files that did not match.',
        },
      ],
    },
    {
      id: 'one-app',
      title: 'One app',
      blocks: [
        {
          type: 'p',
          text: 'I built one web app for invoicing, clients, payments, and the numbers they check. Same work, fewer steps. Under five minutes per invoice once it was live.',
        },
      ],
    },
    {
      id: 'in-production',
      title: 'In production',
      blocks: [
        {
          type: 'p',
          text: 'Live with the manufacturing client since June 2026. Still updating it as freelance work.',
        },
      ],
    },
  ],
}

export default post
