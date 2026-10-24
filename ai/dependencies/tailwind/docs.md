# Tailwind CSS v4

**Status: partial snapshot.** Docs not fetched (network timeouts). Links:

- https://tailwindcss.com/docs/installation/framework-guides/nextjs
- https://tailwindcss.com/docs/theme
- https://tailwindcss.com/docs/upgrade-guide

## Setup used here

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  --color-background: var(--bg);
  --font-sans: var(--font-grotesque);
}
```

```js
// postcss.config.mjs
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`@tailwindcss/postcss` and `postcss` are devDependencies. No `tailwind.config.js` — v4 is
CSS-first; tokens live in `@theme`.

## Verified behaviour

- Theme colours defined as CSS variables work with opacity modifiers (`bg-foreground/5`,
  `border-rule`), and computed styles resolve to `oklab(...)` / `color-mix(...)`, which is fine
  in all current browsers.
- Arbitrary values used here compile: `text-[11px]`, `aspect-4/5`, `min-h-11`, `size-11`,
  `tracking-[0.3em]`, `text-[clamp(2.75rem,13vw,7.5rem)]`.
- `text-balance` is supported.
- Do **not** use `@tailwindcss/turbopack` as a Turbopack CSS loader in this environment — it
  crashes with SIGBUS. Use the PostCSS pipeline instead.
