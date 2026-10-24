# Feature: Landing Page

## Purpose

Give notlilmoe a single mobile-first page that looks like the blonded.co lineage — one grotesque, monochrome, hairline rules, almost no words — and holds the space where the email gate will live.

## User Flow

1. Fan opens the site on a phone.
2. Wordmark, one line of identity, and the email field fill the first screen.
3. Fan scrolls a little: one large image slot and the streaming step placeholder.
4. Footer carries socials and the privacy policy link.
5. Nothing is submitted yet — this feature is the shell.

## Rules

- Layout is designed at 375px and scales up; no desktop-only layout.
- All copy, links, and colors come from `config/artist.ts` — no strings or hex values in components.
- Light theme (warm paper, near-black type); the accent is a single value that can change per release and must stay dark enough to read on the paper.
- No rounded cards, gradients, shadows, or stock icons. Hairline `1px` rules and type do the structuring.
- One image slot only; it renders a neutral placeholder when no photo exists.
- Type-only identity: the page must look finished before any photography exists.

## Acceptance Criteria

- [ ] Page renders at 375px with no horizontal scroll; body copy is at least 13px and micro-labels at least 11px (uppercase, wide tracking — 14px would break the label hierarchy the design depends on).
- [ ] Wordmark sits small and left-aligned at the top; the email field is the visual focal point.
- [ ] Email input is a single hairline-underlined line, not a boxed input, and the submit affordance is a `→`.
- [ ] Every tappable element has a hit area of at least 44px.
- [ ] Streaming step renders as two full-width text rows divided by 1px rules.
- [ ] Changing `accent` in `config/artist.ts` recolors the page without touching components.
- [ ] Footer links to `/privacy` (route may 404 until feature 4).
- [ ] `npm run build` passes with no type errors.
