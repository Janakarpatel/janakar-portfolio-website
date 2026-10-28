import type { Post } from '../types'

const post: Post = {
  slug: 'palmauth-edge',
  kind: 'project',
  title: 'PalmAuth Edge',
  date: 'December 2023',
  listDate: '01/12 / 2023',
  summary:
    'Palmprint authentication that stays on the device — MediaPipe for the region of interest, a custom CV model, and a Raspberry Pi for inference.',
  sections: [
    {
      id: 'no-round-trip',
      title: 'No round-trip',
      blocks: [
        {
          type: 'p',
          text: 'I did not want palm auth that had to phone home.^[1] Extract the palm on device, classify it there, decide there.',
        },
      ],
    },
    {
      id: 'the-palm',
      title: 'The palm',
      blocks: [
        {
          type: 'p',
          text: 'MediaPipe finds the region of interest. A small preprocessing pipeline gets samples ready for training. The model sits on a Raspberry Pi and runs in real time — around 90% accuracy on our set.',
        },
      ],
    },
    {
      id: 'on-the-pi',
      title: 'On the Pi',
      nav: 'On the Pi',
      blocks: [
        {
          type: 'p',
          text: 'Python end to end. Built July through December 2023. The interesting constraint was always the board, not the notebook.',
        },
      ],
    },
  ],
  footnotes: [
    {
      id: '1',
      text: 'Edge here means the Pi on the desk — not a marketing synonym for “cloud nearby.”',
    },
  ],
}

export default post
