# Next.js 16.4.3

**Status: partial snapshot.** Official docs could not be fetched over this connection
(registry and docs sites are timing out at ~70KB/s). What follows was verified by building
this project, not copied from upstream. Fetch the full docs when the network is stable.

- https://nextjs.org/docs/app
- https://nextjs.org/docs/messages/blocking-prerender-current-time

## Verified behaviour (this project)

- **Turbopack is the default** bundler for `next dev` and `next build` in v16.
- **`cacheComponents: true`** in `next.config.ts` makes the build fail on unstable values read
  during prerender. `new Date()` inside a component throws:
  `Next.js encountered the unstable value new Date() while prerendering`.
  Fix used here: mark the component `async` and add `"use cache"` at the top of its body, so the
  value is frozen at build time (`components/footer.tsx`).
- **`partialPrefetching: true`** is accepted alongside `cacheComponents`.
- The App Router alias `@/*` maps to the project root, so `@/config/artist` works without a
  `src/` directory.
- Server Components are the default. `components/*` currently ship zero client JS.

## Notes

- Static output means the copyright year is whatever year the site was built in. A redeploy is
  needed at the turn of the year — acceptable, and cheaper than making the page dynamic.
