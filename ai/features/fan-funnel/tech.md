# Technical Plan: Fan Funnel

## Components

- `app/page.tsx` — landing. Hosts the subscribe form; the old streaming step is removed.
- `components/subscribe-form.tsx` — client component. Two hairline-underlined fields (Name, Email), the `→` submit, inline field errors, pending state via `useActionState`. Works without JS because it posts the server action as a plain form.
- `app/actions/subscribe.ts` — `"use server"`. Validates, upserts the subscriber, sets the gate cookie, redirects to `/listen`.
- `app/listen/page.tsx` — server component. Reads the gate cookie, redirects to `/` when absent, renders a `min-h-dvh` column of the two platform rows.
- `components/platform-item.tsx` — one full-width row: logo, service name in the existing large uppercase type, `→`. Links to `/go/<platform>`.
- `components/platform-logo.tsx` — inline SVG marks, no dependency, no network request.
- `app/go/[platform]/route.ts` — validates the slug, records the choice, 302s to the profile URL from config.
- `lib/validation.ts` — `parseFan(input)` → `{ ok: true, name, email }` or `{ ok: false, field, message }`. Imported by both the form and the action.
- `lib/subscribers.ts` — `upsertSubscriber({ name, email })`, `recordPlatform(id, platform)`. Only module touching the table.
- `lib/fan-cookie.ts` — `setFanCookie(id)`, `readFanId()`, cookie name `nlm_fan`.
- `lib/supabase.ts` — server-only client built from the service role key.
- `config/artist.ts` — real profile URLs (already set: `open.spotify.com/artist/7KEeOhkWNRV8cNMAkbZJ5q` and `music.apple.com/ng/artist/notlilmoe/1533854366`).

Delete `components/email-step.tsx` and `components/streaming-step.tsx`; their roles move to the form and `/listen`.

## API

- Server Action `subscribe(prevState, formData)` — upsert, then redirect. Returns `{ field, message }` only on failure.
- `GET /go/spotify` \| `/go/apple-music` — record then redirect; unknown slug → `redirect('/')`.

## Data Model

```sql
create table public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  name       text not null,
  platform   text check (platform in ('spotify', 'apple-music')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscribers enable row level security;  -- no policies: service role only
```

Upsert with `onConflict: 'email'`; the payload sets `name`, `updated_at`, and leaves `created_at` at its default.

## Flow

`POST /` (action) → `parseFan` → `upsertSubscriber` → `setFanCookie` → `redirect('/listen')` → tap → `GET /go/<platform>` → `recordPlatform` → `302` to `artist.*Url`.

## Notes

- **Gate cookie** — `nlm_fan`, httpOnly, `sameSite=lax`, `secure` in production, `path=/`, 180 days, value is the subscriber id. Unsigned in v1: forging it only reveals links that are public anyway. Sign it with an HMAC if abuse appears.
- **Next 16 specifics** — `cookies()` and route `params` are async (`await cookies()`, `params: Promise<{ platform: string }>`). Cookies can only be set in actions and route handlers. `redirect()` throws, so keep `try/catch` wrapped around the Supabase call only, never around the redirect.
- **`cacheComponents`** — `/listen` reads cookies, so it is dynamic by nature; do not put `use cache` on it.
- **Failure mode** — a missing or wrong Supabase key must surface as a form error, never as a silent success. Losing a fan quietly is the one unrecoverable outcome.
- **Logos** — path data from simple-icons (CC0), inlined; marks are trademarks of Spotify and Apple, used here only to link to the artist profiles. Spotify `#1DB954`, Apple Music flat `#FA243C` (its official mark is a gradient; a gradient would break the design rules, so it is flattened). Marks render at 32px in the row, with the service name carrying the scale.
- **Blocker** — this feature needs a Supabase project: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (gitignored) and later in Vercel. Nothing can be written until the project exists.
- **Supersedes** — feature 1's "streaming step renders as two full-width text rows" criterion is retired; the platform choice now lives on its own page.
