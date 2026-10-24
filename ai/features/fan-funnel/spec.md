# Feature: Fan Funnel

## Purpose

Turn a visitor into a named, contactable fan and hand them to the streaming service they actually use. The form is the price of the links; `/listen` is the reward.

## User Flow

1. Fan opens `/` on a phone: wordmark, tagline, image slot, and a form asking for **Name** and **Email**.
2. Fan fills both fields and taps `→`.
3. The button shows a pending state until the write completes.
4. On success the browser navigates to `/listen` — a page where Spotify and Apple Music are the two main items on screen, each with its logo.
5. Fan taps a platform. The choice is recorded against their record and the browser opens the artist profile on that service.
6. A fan who comes back later and submits again with the same email sees no error and passes the gate again.

## Rules

- Both fields are required. Name is 1–80 characters after trimming; email is at most 254 characters and must look like an address.
- Validation lives in `lib/validation.ts` and runs in the browser and in the action. The server is the authority; the client copy only makes errors fast.
- Emails are stored trimmed and lowercased. Duplicate email upserts: `name`, `platform`, `updated_at` refresh, `created_at` and `id` are preserved.
- Failure never loses the fan's typing: on a validation or write error the form keeps the entered values and shows a message under the offending field.
- The submit control is disabled while the request is in flight, so a double tap cannot write twice.
- `/listen` requires the cookie set at submit time; without it the request redirects to `/`. A shared `/listen` link does not bypass the gate.
- Every platform tap goes through `/go/<platform>` (only `spotify` and `apple-music` are valid; anything else redirects to `/`), so the choice is recorded before the fan leaves.
- Destination URLs come from `config/artist.ts` only.
- Design stays inside the existing system: paper background, ink type, hairline rules, one accent. No gradients, no cards, no shadows.
- No third-party trackers, pixels, or analytics.
- The form must still work with JS disabled — a plain POST lands on `/listen`.

## Acceptance Criteria

- [ ] Submitting a valid name + email navigates to `/listen` and creates one `subscribers` row with `name`, lowercased `email`, and `created_at`.
- [ ] Submitting the same email twice leaves exactly one row; `name` updates and `created_at` is unchanged.
- [ ] An invalid email shows an inline message, does not navigate, and writes nothing.
- [ ] An empty or whitespace-only name is rejected the same way.
- [ ] A failed write (DB down / bad credentials) shows a retry message and keeps the form on `/` with both values intact.
- [ ] `/listen` opened with no cookie redirects to `/`.
- [ ] At 375×812 both platform items are visible without scrolling.
- [ ] Each platform row is at least 96px tall with a tap target of at least 44px, and shows the service's logo.
- [ ] Tapping Spotify sets `platform = 'spotify'` on that subscriber and lands on `artist.spotifyUrl`.
- [ ] Tapping Apple Music sets `platform = 'apple-music'` and lands on `artist.appleMusicUrl`.
- [ ] `/go/tidal` redirects to `/` and writes nothing.
- [ ] No horizontal scroll at 375px; smallest type stays 11px.
- [ ] `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` all pass.

## Out of Scope

- Double opt-in, welcome email, or any ESP integration.
- A thanks page, unsubscribe flow, or admin UI — reads happen in the Supabase dashboard.
