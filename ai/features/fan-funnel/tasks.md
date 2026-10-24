# Tasks: Fan Funnel

- [ ] Create the Supabase project, run the `subscribers` table + RLS SQL, and put `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. *(blocked on project credentials)*
- [ ] Add `lib/supabase.ts` — server-only client; verify a trivial select fails loudly with a bad key.
- [ ] Add `lib/validation.ts` — `parseFan` for name + email with the spec's limits.
- [ ] Add `lib/subscribers.ts` — `upsertSubscriber` and `recordPlatform`; verify a duplicate email updates instead of erroring.
- [ ] Add `lib/fan-cookie.ts` — set/read the `nlm_fan` cookie.
- [ ] Add `app/actions/subscribe.ts` — validate, upsert, set cookie, redirect to `/listen`.
- [ ] Build `components/subscribe-form.tsx` (Name + Email, `→`, inline errors, pending state) and mount it on `/`; delete `email-step.tsx`.
- [ ] Add `components/platform-logo.tsx` with the Spotify and Apple Music marks.
- [ ] Build `app/listen/page.tsx` + `components/platform-item.tsx` with the cookie gate; delete `streaming-step.tsx`.
- [ ] Add `app/go/[platform]/route.ts` — record then 302; reject unknown slugs.
- [ ] Verify end to end at 375px: submit → `/listen` → tap each platform → row has the right `platform`; no-cookie visit redirects; duplicate email keeps one row.
- [ ] Confirm `tsc`, `lint`, and `build` pass, and that disabled-JS submit still reaches `/listen`.
