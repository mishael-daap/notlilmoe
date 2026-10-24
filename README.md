# notlilmoe

Official site for **notlilmoe**. One mobile-first page that introduces the artist, collects a fan's name and email, then sends them to the artist's profile on the streaming service they actually use.

## How it works

```
/            name + email form  ──submit──▶  EmailJS notification + optional DB write
                                             │
/listen      Spotify / Apple Music  ◀────────┘  (public page)
             │
/go/<slug>   records the choice, then 302s to the artist profile
```

- `/listen` is public: the form is what captures a fan, the picker just routes them. A `nlm_fan` cookie is set at submit so `/go/<slug>` can record which service they chose.
- The notification email is the primary capture channel; Supabase is optional until a project exists.

## Stack

- Next.js 16 (App Router, `cacheComponents`, `partialPrefetching`), React 19, TypeScript strict
- Tailwind CSS v4 via PostCSS
- EmailJS over plain `fetch` — no SDK, no Resend
- Supabase PostgREST over plain `fetch` — no SDK
- System grotesque type stack, zero webfonts

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
```

## Environment

Copy the variables into `.env.local` (gitignored):

| Variable | Purpose |
|---|---|
| `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` | Where fan notifications go. The browser sends these. |
| `EMAILJS_PRIVATE_KEY` | Only needed if server-side sends are enabled in the EmailJS dashboard |
| `NOTIFY_EMAIL` | Inbox that receives new-fan emails |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Optional. Enables storing the list. |

The EmailJS template should read `{{name}}`, `{{email}}`, `{{submitted_at}}`, with To Email `{{to_email}}` and Reply To `{{reply_to}}`. Common aliases (`from_name`, `from_email`, `time`, `message`) are also sent.

## Structure

```
app/         page (form), listen (platform page), go/[platform] (redirect), actions/subscribe
components/  wordmark, subscribe-form, hero-media, platform-item, platform-logo, footer
lib/         validation, subscribers, notify, fan-params, fan-cookie, platforms, supabase
config/      artist.ts — all copy, colours, profile URLs and socials
ai/          project notes and feature specs
public/      images
```

Edit content in `config/artist.ts` only; components never hardcode copy or links.

## Notes

- Duplicate emails upsert: a fan resubmitting never sees an error.
- A failed write or send surfaces as a retry message — a fan is never silently dropped.
- No analytics, no third-party trackers.
