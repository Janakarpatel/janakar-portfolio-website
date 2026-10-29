import type { Post } from '../types'

const post: Post = {
  slug: 'cline-ai',
  kind: 'project',
  title: 'CliNe',
  date: '27 August, 2023',
  listDate: '27/08 / 2023',
  summary:
    'A Chrome extension that flags clickbait headlines while you browse. LSTM model, small Flask API, score in a popup.',
  sections: [
    {
      id: 'why',
      title: 'Why',
      blocks: [
        {
          type: 'p',
          text: 'I kept clicking headlines that oversold the article. I wanted something in the browser that could warn me before I opened the tab.',
        },
        {
          type: 'image',
          src: '/projects/cline-ai/banner.png',
          alt: 'CliNe Chrome extension banner',
        },
      ],
    },
    {
      id: 'how-it-works',
      title: 'How it works',
      nav: 'How it works',
      blocks: [
        {
          type: 'p',
          text: 'An LSTM trained on labeled headlines with GloVe embeddings. About 93% on trending titles from live news feeds.^[1] A Flask API on [Render](https://render.com) returns the score; the extension shows it in a popup.',
        },
        {
          type: 'p',
          text: 'You can also report false positives and false negatives from the extension, so the model can improve after launch.',
        },
        {
          type: 'image',
          src: '/projects/cline-ai/frames.png',
          alt: 'Figma canvas with CliNe logo, popup, and UI shots while designing the extension',
          caption: 'Figma canvas while we designed it: logo, popup, shots.',
        },
      ],
    },
    {
      id: 'in-the-browser',
      title: 'In the browser',
      nav: 'In the browser',
      blocks: [
        {
          type: 'p',
          text: 'On a news site it scans the headlines on the page, marks the ones that look like bait, and shows the score in the popup if you want more detail.',
        },
        {
          type: 'image',
          src: '/projects/cline-ai/extension-ss.png',
          alt: 'CliNe Chrome extension highlighting headlines on a news page',
          caption: 'Live on a news page.',
        },
        {
          type: 'image',
          src: '/projects/cline-ai/homepage.png',
          alt: 'CliNe project homepage',
          caption: 'Project site.',
        },
      ],
    },
    {
      id: 'the-api',
      title: 'The API',
      blocks: [
        {
          type: 'p',
          text: 'The extension calls a small Flask service. Source is on [GitHub](https://github.com/Janakarpatel/CliNe_API). POST a headline to /predict:',
        },
        {
          type: 'code',
          language: 'json',
          code: `{
  "text": "You will not believe what happened next"
}`,
          caption: 'Request',
        },
        {
          type: 'code',
          language: 'json',
          code: `{
  "label": "clickbait"
}`,
          caption: 'Response',
        },
        {
          type: 'p',
          text: 'The label is clickbait or not clickbait. Extension code is [here](https://github.com/Janakarpatel/CliNe.AI_Chrome-Extension).',
        },
      ],
    },
  ],
  footnotes: [
    {
      id: '1',
      text: 'Scored on headlines from live news feeds, not a cleaned-up benchmark set.',
    },
  ],
}

export default post
