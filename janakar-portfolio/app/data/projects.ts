export type ProjectSection = {
  id: string
  title: string
  paragraphs: string[]
}

export type Project = {
  slug: string
  title: string
  /** Display date, e.g. "14 Oct, 2026" */
  date: string
  /** Compact list date, e.g. "14/10 / 2026" */
  listDate: string
  summary: string
  sections: ProjectSection[]
}

export const projects: Project[] = [
  {
    slug: 'b2b-invoice-analytics',
    title: 'B2B Invoice & Analytics',
    date: 'June 2026 – Present',
    listDate: '01/06 / 2026',
    summary:
      'A production platform for a fasteners manufacturer: invoicing, analytics, clients, and payments in one web app — built as freelance work to replace Word and Excel billing.',
    sections: [
      {
        id: 'problem',
        title: 'Problem',
        paragraphs: [
          'The company ran billing in Word and Excel. Creating a single invoice took about twenty minutes, and client records, payments, and reporting lived in separate files.',
        ],
      },
      {
        id: 'build',
        title: 'Build',
        paragraphs: [
          'I shipped a unified web app for invoicing, analytics, client management, and payment tracking. Invoice creation dropped from twenty minutes to under five per invoice.',
        ],
      },
      {
        id: 'status',
        title: 'Status',
        paragraphs: [
          'Live in production for the manufacturing client. Ongoing freelance engagement since June 2026.',
        ],
      },
    ],
  },
  {
    slug: 'palmauth-edge',
    title: 'PalmAuth Edge',
    date: 'December 2023',
    listDate: '01/12 / 2023',
    summary:
      'A mobile-optimized palmprint detection system for real-time authentication on the edge — Python, MediaPipe, and a Raspberry Pi.',
    sections: [
      {
        id: 'idea',
        title: 'Idea',
        paragraphs: [
          'I wanted palmprint authentication that could run without a cloud round-trip: extract a region of interest on device, then classify it with a custom computer-vision model.',
        ],
      },
      {
        id: 'build',
        title: 'Build',
        paragraphs: [
          'MediaPipe handles ROI extraction. Custom image processing prepares samples for model training. The stack runs on a Raspberry Pi for real-time inference at about 90% accuracy.',
        ],
      },
      {
        id: 'stack',
        title: 'Stack',
        paragraphs: [
          'Python, MediaPipe, custom CV training pipeline, Raspberry Pi deployment. Built July–December 2023.',
        ],
      },
    ],
  },
  {
    slug: 'cline-ai',
    title: 'CliNe AI',
    date: 'August 2023',
    listDate: '01/08 / 2023',
    summary:
      'A Chrome extension that classifies trending news headlines in real time with an LSTM model — ranked #18 on Product Hunt and listed on the Chrome Web Store.',
    sections: [
      {
        id: 'idea',
        title: 'Idea',
        paragraphs: [
          'Trending headlines move fast. CliNe scores them live so readers can skim with more signal and less noise.',
        ],
      },
      {
        id: 'build',
        title: 'Build',
        paragraphs: [
          'I trained an LSTM NLP model on labeled headlines with GloVe embeddings (~93% accuracy on live trending text). A Flask API on Render serves predictions; the JavaScript extension calls it from the browser.',
          'I led a five-person team through development. The project ranked #18 on Product Hunt, listed on the Chrome Web Store, and reached 230+ users through organic search.',
        ],
      },
      {
        id: 'stack',
        title: 'Stack',
        paragraphs: [
          'LSTM + GloVe, Flask, Render, Chrome extension (JavaScript). June–August 2023.',
        ],
      },
    ],
  },
  {
    slug: 'pseudo-ai',
    title: 'Pseudo AI',
    date: 'June 2023',
    listDate: '01/06 / 2023',
    summary:
      'A Next.js site that turns any programming code into pseudo-code — built to cut documentation time for students, with Figma prototypes and the OpenAI API.',
    sections: [
      {
        id: 'idea',
        title: 'Idea',
        paragraphs: [
          'Students spend too long rewriting code as prose for assignments and notes. Pseudo AI does that translation so they can focus on the algorithm.',
        ],
      },
      {
        id: 'build',
        title: 'Build',
        paragraphs: [
          'Next.js front end, OpenAI GPT API for conversion, interactive prototypes in Figma. Deployed on Vercel. Reduced technical documentation time by about 35% for student users.',
        ],
      },
      {
        id: 'stack',
        title: 'Stack',
        paragraphs: [
          'Next.js, OpenAI API, Figma, Vercel. May–June 2023.',
        ],
      },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
