# Architecture

## Stack

- **Frontend**: Next.js (App Router) + TypeScript, Tailwind CSS for styling. No component library.
- **Backend**: Next.js Server Actions on the same origin — no separate API service.
- **Database**: Supabase (hosted Postgres, free tier). One table.
- **Other**: Vercel for hosting (free tier).

## System Structure

- `app/page.tsx` — the landing page: identity, image slot, and the name + email form.
- `app/listen/page.tsx` — the platform page. Two large hairline rows, Spotify and Apple Music, each with its logo. Gated by the fan cookie; redirects to `/` without it.
- `app/go/[platform]/route.ts` — records the fan's platform choice, then 302s to the profile URL.
- `app/actions/subscribe.ts` — server action that validates, upserts a subscriber, sets the gate cookie, redirects to `/listen`.
- `app/privacy/page.tsx` — static privacy policy.
- `components/` — wordmark, subscribe form, platform row, platform logo, image slot, footer.
- `lib/supabase.ts` — server-only Supabase client (service role key).
- `lib/validation.ts` — name/email schema shared by the form and the action.
- `lib/subscribers.ts` — the only module that reads or writes the `subscribers` table.
- `config/artist.ts` — artist name, tagline, profile URLs, socials. Single place to edit content.

## Data Flow

Fan → `/` (name + email) → server action → Supabase `subscribers` upsert → gate cookie → redirect to `/listen` → fan taps Spotify or Apple Music → `/go/<platform>` records the choice → 302 to the profile URL.

Platform choice is recorded on the same subscriber, so we learn which service the audience uses.

## Core Entities

- **Subscriber** — one fan: name, email (unique, lowercased), optional platform, timestamps. Re-submitting an existing email updates the row instead of erroring.

## Key Decisions

- **Two routes, not one.** `/` captures the fan; `/listen` is a separate page where the two platforms are the main content, not links tucked at the bottom. Submitting navigates for real, so the platform page has its own URL, its own history entry, and can be shared.
- **The email gate is required** to reach the platform page, and it is enforced by a cookie set at submit time rather than by the URL. Without the cookie, `/listen` redirects to `/`. It is the only reason the site exists; the platform page is the reward.
- **Platform taps go through `/go/<platform>`** so the choice is recorded before the fan leaves. One extra hop, and the profile URL still comes from `config/artist.ts`.
- **Logos, not text rows.** The two platforms are the main items on `/listen`, so each row carries the service's mark at a size you can recognise at a glance, in its brand colour.
- **Supabase over a CRM.** The list stays ours and is exportable to Mailchimp/Resend/etc. later. No ESP is wired in v1.
- **Writes are server-side only.** The service role key never reaches the browser; RLS is on and there are no public read policies.
- **Profile URLs and socials live in `config/artist.ts`**, not hardcoded in components, so links can change without touching markup.
- **Duplicate emails upsert** — same fan submitting twice updates `name`/`platform`/`updated_at`, never shows an error.
- **No analytics or third-party trackers** in v1. Fits the privacy story and the free tier.
- **No auth, no accounts, no admin UI.** Reads happen in the Supabase dashboard.

## Constraints

- Free tier only: Vercel Hobby, Supabase Free.
- Mobile-first CSS; test at 375px width before any desktop polish.
- No paid fonts, stock subscriptions, or hosted CMS — content is edited in the repo.
- Keep the page fast: no heavy media, no animation libraries.
