# Janakar Portfolio

Personal portfolio site for [Janakar Patel](https://janakarpatel.vercel.app) — engineer, artist, and Data/AI practitioner based in Ahmedabad, India.

Built with Next.js 15 (App Router), featuring an animated Three.js Möbius strip background and Lenis smooth scrolling.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| 3D Background | [Three.js](https://threejs.org) |
| Smooth Scroll | [Lenis](https://lenis.darkroom.engineering) |
| Icons | [Lucide React](https://lucide.dev) |
| Language | TypeScript |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
janakar-portfolio/
├── app/
│   ├── components/          # Shared UI components
│   │   ├── Footer.tsx       # Live clock + Möbius equations
│   │   ├── LenisProvider.tsx
│   │   └── MobiusBackground.tsx
│   ├── contact/
│   │   └── page.tsx         # Contact / communication preferences
│   ├── context/
│   │   └── MobiusContext.tsx # Three.js scene lifecycle
│   ├── hooks/
│   │   └── useLiveTimestamp.ts
│   ├── globals.css          # Global styles & CSS variables
│   ├── layout.tsx           # Root layout, fonts, providers
│   └── page.tsx             # Home page
├── docs/
│   └── ARCHITECTURE.md      # Detailed architecture notes
├── public/
│   └── Frame 2.svg          # Favicon
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — bio, social links, introduction |
| `/contact` | Contact preferences, email, social links, scheduling notes |

## Key Features

### Möbius Strip Background

A parametric point cloud rendered with Three.js persists across all routes. Points pulse outward on a sine wave and cycle through a custom purple palette. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for implementation details.

### Smooth Scrolling

Lenis provides inertial scroll on all pages via a root-level provider in `layout.tsx`.

### Responsive Layout

Tailwind breakpoints at 768px and 480px adapt typography and spacing for mobile.

## Configuration

- **Möbius animation** — edit `MOBIUS_CONFIG` in `app/context/MobiusContext.tsx`
- **Fonts** — loaded via `next/font/google` in `app/layout.tsx`
- **Theme colors** — CSS variables in `app/globals.css` and Tailwind extensions in `tailwind.config.ts`

## Deployment

The site is deployed on [Vercel](https://vercel.com). Push to the connected branch to trigger a deploy, or run:

```bash
npm run build
npm run start
```

## License

Private project. All rights reserved.
