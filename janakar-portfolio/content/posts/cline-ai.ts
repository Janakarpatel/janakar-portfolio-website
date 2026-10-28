import type { Post } from '../types'

const post: Post = {
  slug: 'cline-ai',
  kind: 'project',
  title: 'CliNe AI',
  date: '27 August, 2023',
  listDate: '27/08 / 2023',
  summary:
    'CliNe is a Chrome extension that scores news headlines for clickbait while you browse. An LSTM behind a small Flask API, a popup in the corner, and a little less trust wasted on a title.',
  sections: [
    {
      id: 'why',
      title: 'Why',
      blocks: [
        {
          type: 'p',
          text: 'I kept opening tabs that promised one thing and delivered another. Headlines are a weak signal on purpose — they get the click, then the article negotiates. I wanted something that sat in the browser and said, quietly, before I clicked: this one looks like bait.',
        },
        {
          type: 'image',
          src: '/projects/cline-ai/banner.png',
          alt: 'CliNe AI Chrome extension banner',
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
          text: 'The model is an LSTM trained on labeled headlines with GloVe embeddings. It hit about 93% on the set we cared about — live trending titles, not tidy lab text.^[1] Predictions come from a Flask API we hosted on [Render](https://render.com); the extension calls it and paints the result in a popup.',
        },
        {
          type: 'image',
          src: '/projects/cline-ai/popup.png',
          alt: 'CliNe popup UI design',
          caption: 'The popup — score the title, move on.',
        },
        {
          type: 'p',
          text: 'You can report false positives and false negatives from the extension. That was the boring part that mattered: a model stuck at launch day is just a demo.',
        },
        {
          type: 'image',
          src: '/projects/cline-ai/frames.png',
          alt: 'CliNe UI design frames for the extension',
          caption: 'UI frames for the extension.',
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
          text: 'On a news site it watches the headlines on the page. Flagged titles get a quiet mark; the popup shows the score if you want the detail. We designed for something you forget is there until a title tries too hard.',
        },
        {
          type: 'image',
          src: '/projects/cline-ai/extension-ss.png',
          alt: 'CliNe Chrome extension highlighting headlines on a news page',
          caption: 'Live on a news page.',
        },
        {
          type: 'image',
          src: '/projects/cline-ai/ss2.jpeg',
          alt: 'CliNe extension showcase shot',
          caption: 'Another pass on a feed.',
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
      id: 'shipping',
      title: 'Shipping',
      blocks: [
        {
          type: 'p',
          text: 'I led a five-person team through the build, from June into late August 2023. We launched on Product Hunt and landed at #18 that day, got listed on the Chrome Web Store, and picked up users from search — a little over 230 by the time we stopped refreshing the dashboard.^[2]',
        },
        {
          type: 'p',
          text: 'Code for the extension is on [GitHub](https://github.com/Janakarpatel/CliNe.AI_Chrome-Extension). The API lives in a [sibling repo](https://github.com/Janakarpatel/CliNe_API).',
        },
        {
          type: 'p',
          text: 'If a headline still gets you, at least you saw it coming.',
        },
      ],
    },
  ],
  footnotes: [
    {
      id: '1',
      text: 'Lab accuracy is a vanity metric if the titles people actually see look nothing like the training set.',
    },
    {
      id: '2',
      text: 'Product Hunt rank is a one-day number. The Chrome Web Store listing outlasted the launch week.',
    },
  ],
}

export default post
