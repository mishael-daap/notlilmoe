# Technical Plan: Landing Page

## Components

- `app/layout.tsx` — html/body, font, metadata (title, description, OG, theme-color), `bg`/`fg` from config.
- `app/page.tsx` — the funnel shell: hero, image slot, streaming step placeholder, footer.
- `app/globals.css` — Tailwind import plus CSS custom properties for the design tokens.
- `components/wordmark.tsx` — small wordmark, top-left.
- `components/email-step.tsx` — presentational email line (input + `→`), no submit logic yet.
- `components/streaming-step.tsx` — two hairline rows: Spotify, Apple Music. Links only, no capture yet.
- `components/footer.tsx` — socials, privacy link, year.
- `components/image-slot.tsx` — 4:5 full-bleed image or a neutral placeholder block.
- `config/artist.ts` — name, tagline, accent, background, foreground, profile URLs, socials.

## API

None in this feature.

## Data Model

None in this feature.

`config/artist.ts` shape:

```ts
export const artist = {
  name: string;          // "notlilmoe"
  tagline: string;       // one line
  accent: string;        // hex, per-release
  background: string;    // hex
  foreground: string;    // hex
  image: string | null;  // /images/... or null
  spotifyUrl: string;
  appleMusicUrl: string;
  socials: { label: string; href: string }[];
}
```

## Flow

Browser → `app/page.tsx` → renders from `config/artist.ts` → static HTML, no client JS in this feature.

## Notes

- Tokens are CSS variables set once in `globals.css` and overridden inline from config in `layout.tsx`, so Tailwind utilities like `bg-background` / `text-foreground` stay usable.
- Font: a single system grotesque stack — `"Helvetica Neue", Helvetica, Arial, sans-serif` — which resolves to each phone's native grotesque (Helvetica on iOS, Roboto on Android) and matches the blonded.co Univers feel with zero payload. Self-hosting Archivo remains an option once the network situation allows downloading it.
- Tailwind v4 through the standard PostCSS pipeline (`@tailwindcss/postcss` + `postcss.config.mjs`), not the Turbopack CSS loader — the Turbopack loader crashed with SIGBUS in this environment (corrupt native binaries after an interrupted install; `@next/swc-linux-x64-gnu` and `lightningcss-linux-x64-gnu` had to be reinstalled).
- Next 16.4.3 with `cacheComponents` and `partialPrefetching` enabled. Anything reading the clock at render time needs `"use cache"` — see `components/footer.tsx`.
- No client components in this feature; step switching arrives with feature 2.
- Light theme. `--bg` / `--fg` / `--accent` are warm paper `#f4f2ee`, ink `#101010`, and `#5a6b00`; `color-scheme` is `light` in both `globals.css` and the viewport export so scrollbars and form UI follow.
- Muted tiers are alpha steps of the foreground, not separate colors. Ink-on-paper needs a higher alpha than paper-on-ink for the same ratio, so the tiers sit at /45 (copyright, image placeholder), /50 (status, privacy), /55 (micro-labels, input placeholder), /60 (subline), /70 (socials), with `--rule` at 22%. Retune them together if the background changes.

## Verified

Measured in headless Chrome at 375x812 and 1280x900 after the build:

- No horizontal overflow at either width; page height 1333px on mobile.
- Smallest type 11px (micro-labels); body copy 13px; email input 44px tall.
- Accent from `config/artist.ts` reaches the DOM as `rgb(90, 107, 0)` — 5.3:1 on the paper background (the previous `#d8ff3e` lime measured 1.03:1 and had to go).
- `color-scheme` resolves to `light`; `theme-color` meta resolves to `#f4f2ee`.
