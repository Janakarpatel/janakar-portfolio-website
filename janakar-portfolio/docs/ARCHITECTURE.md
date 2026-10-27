# Architecture

This document describes how the portfolio site is structured and how its main systems work.

## Application Shell

```
RootLayout (app/layout.tsx)
├── MobiusProvider        ← Three.js scene + shared canvas ref
│   ├── MobiusBackground  ← Fixed <canvas> element
│   └── LenisProvider     ← Smooth scroll RAF loop
│       └── {page content}
```

All pages render inside this shell. The Möbius animation and Lenis instance are created once and persist across client-side navigations.

## Routing

Next.js App Router with two routes:

| File | Route | Rendering |
|------|-------|-----------|
| `app/page.tsx` | `/` | Client component |
| `app/contact/page.tsx` | `/contact` | Client component |

Both pages are client components because they use the `useLiveTimestamp` hook for the footer clock.

## Möbius Background System

### Components

- **`MobiusProvider`** (`app/context/MobiusContext.tsx`) — owns the Three.js lifecycle: scene, camera, renderer, geometry, animation loop, resize handler, and cleanup.
- **`MobiusBackground`** (`app/components/MobiusBackground.tsx`) — attaches the shared `<canvas>` ref to the DOM as a fixed, non-interactive layer behind content.

### Parametric Surface

The Möbius strip is generated from the standard parametric equations (shown in the footer):

```
x = (R + v·cos(u/2))·cos(u)
y = (R + v·cos(u/2))·sin(u)
z = v·sin(u/2)
```

Where `u` sweeps 0 → 2π around the strip and `v` spans the strip width. Each vertex receives random jitter for an organic point-cloud feel.

### Animation

On every frame:

1. **Pulse spread** — a sine wave drives points outward along precomputed random direction vectors.
2. **Color flow** — vertex colors interpolate through `MOBIUS_CONFIG.colorPalette` based on each point's `u` coordinate and elapsed time.
3. **Rotation** — the strip rotates slowly on X and Y axes.

### Route-Aware Clock Reset

When the user navigates back to `/`, the Three.js clock resets so the color animation restarts from the beginning. This is handled by a `usePathname` effect in `MobiusProvider`.

### Configuration

All tunable values live in `MOBIUS_CONFIG` at the top of `MobiusContext.tsx`:

| Property | Purpose |
|----------|---------|
| `uSegments` / `vSegments` | Point density |
| `radius` / `width` | Strip size |
| `jitter` | Random position noise |
| `spreadMultiplier` | Pulse expansion strength |
| `rainbowSpeed` | Color cycle speed |
| `colorPalette` | Hex colors for vertex interpolation |
| `rotation` | Per-frame rotation deltas |

## Smooth Scrolling

`LenisProvider` initializes a Lenis instance with `lerp: 0.1` and drives it through `requestAnimationFrame`. The provider destroys Lenis on unmount. Global CSS in `globals.css` hides scrollbars and sets Lenis-compatible scroll behavior.

## Styling

### Fonts

| Font | Usage | Loading |
|------|-------|---------|
| Geist | Body text (default) | `next/font/google` |
| Bitter | CSS variable available | `next/font/google` |
| Crimson Text | Body paragraphs (`.font-crimson`) | `next/font/google` |
| Sorts Mill Goudy | CSS variable available | `next/font/google` |
| Courier New | Footer equations (`.font-courier`) | System font |

### Theme

Light mode is the default. Dark mode styles exist in `globals.css` (`.dark` body class) but are not currently toggled in the UI.

CSS custom properties in `:root` define letter-spacing tokens and font families. Tailwind extends these in `tailwind.config.ts`.

## Shared Hooks

### `useLiveTimestamp`

Returns a string formatted as `HH:MM:SS - DD/MM/YYYY`, updating every second. Shared by the home and contact pages for the footer clock.

## Path Aliases

TypeScript path alias `@/*` maps to the project root (configured in `tsconfig.json`). Imports use `@/app/...` for consistency.

## Build & Lint

- **Next.js config** — `next.config.ts` enables React Strict Mode.
- **ESLint** — extends `next/core-web-vitals` and `next/typescript` via flat config in `eslint.config.mjs`.
- **PostCSS** — uses `@tailwindcss/postcss` for Tailwind CSS v4 processing.

## Public Assets

| File | Purpose |
|------|---------|
| `public/Frame 2.svg` | Site favicon |

## Performance Notes

- Renderer pixel ratio is capped at 2 for retina displays.
- The Möbius canvas uses `pointer-events-none` so it never blocks interaction.
- The animation loop continues when `isAnimatingRef` is false (reserved for future pause behavior).
