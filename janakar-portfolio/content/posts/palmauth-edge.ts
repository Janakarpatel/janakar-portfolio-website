import type { Post } from '../types'

const post: Post = {
  slug: 'palmauth-edge',
  kind: 'project',
  title: 'PalmAuth Edge',
  date: 'December 2023',
  listDate: '01/12 / 2023',
  summary:
    'Palmprint auth that runs on the device. MediaPipe for the palm region, a custom CV model, inference on a Raspberry Pi.',
  sections: [
    {
      id: 'no-round-trip',
      title: 'No round-trip',
      blocks: [
        {
          type: 'p',
          text: 'I did not want palm auth that sent images to a server.^[1] Find the palm on device, classify it there, decide there.',
        },
      ],
    },
    {
      id: 'the-palm',
      title: 'The palm',
      blocks: [
        {
          type: 'p',
          text: 'MediaPipe finds the region of interest. A short preprocessing step gets samples ready for training. The model runs on a Raspberry Pi in real time, around 90% on our set.',
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
          text: 'Python end to end. Built July through December 2023. The hard part was fitting it on the Pi, not training in a notebook.',
        },
      ],
    },
  ],
  footnotes: [
    {
      id: '1',
      text: 'Edge here means the Pi on the desk, not a nearby cloud.',
    },
  ],
}

export default post
