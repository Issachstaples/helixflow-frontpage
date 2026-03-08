# HelixFlow Frontpage — Context Anchor

This file provides a running orientation for any new session or tool context window.
It summarises the project state, recent work, and active decisions so work can resume
without re-reading the full history.

---

## Project identity

- **Product:** HelixFlow — agency workflow platform (marketing landing page)
- **Company:** Newport E-commerce
- **Repo:** `helixflow-frontpage` (Next.js App Router, TypeScript, Tailwind CSS v4)
- **Live domain (target):** `helixflow.cloud`
- **Branch:** `main`

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict, zero errors) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Animation | Framer Motion — variants in `src/lib/motion.ts` |
| UI components | shadcn/ui (`src/components/ui/`) |
| Form validation | React Hook Form 7 + Zod 4 + `@hookform/resolvers` |
| Email | Resend SDK v6 (`src/app/actions/waitlist.ts`) |
| Fonts | Geist Sans + Geist Mono via `next/font/google` |

---

## Homepage sections (all complete)

`Navbar` → `Hero` → `LifecycleRibbon` → `ModuleGrid` → `StickyStoryboard` →
`AudienceFit` → `ArticlePreviews` → `FAQ` → `RoadmapStatus` → `CTABanner` → `SiteFooter`

All sections are server components except `AudienceFit` (uses `useRef` directly) and
`WaitlistForm` (client form inside `CTABanner`).

---

## Shared primitives

- `src/components/primitives/AnimateIn.tsx` — scroll-entrance wrapper (handles its own client boundary)
- `src/components/primitives/GlassCard.tsx` — polymorphic glass-morphism surface, 3 variants
- `src/components/primitives/SectionWrapper.tsx` — shared section shell, 3 width variants
- `src/components/primitives/LogoMark.tsx` — SVG logomark

---

## Colour system (`hx-*` Tailwind aliases)

Defined in `tailwind.config.ts`. Key tokens:

| Token | Hex | Use |
|---|---|---|
| `hx-void` | `#060D1A` | Page background |
| `hx-aqua` | `#2DBBEE` | Primary accent / CTA |
| `hx-ocean` | `#1466B8` | Secondary accent |
| `hx-mist` | `#F7FBFF` | Headings |
| `hx-chrome` | `#B8C5D6` | Secondary text |
| `hx-slate` | `#7A8FA8` | Body text |

---

## Waitlist flow

### Server action — `src/app/actions/waitlist.ts`
- `"use server"` directive
- Imports `waitlistSchema` and `WaitlistInput` from `src/lib/validators/waitlist`
- Validates with `safeParse`, then sends two emails concurrently via Resend:
  1. Internal notification → `NOTIFY_EMAIL`
  2. User confirmation → the submitted email address
- Checks `{ data, error }` return from each `resend.emails.send()` call (does not rely solely on `try/catch`)
- Graceful fallback: if `RESEND_API_KEY` is absent, logs to console and returns `ok: true`

### Client form — `src/components/sections/WaitlistForm.tsx`
- `"use client"` directive
- React Hook Form + `zodResolver(waitlistSchema)` — schema imported from shared validator
- `useTransition` wraps the server action call
- States: idle → loading (spinner) → success (green-check, focus-managed) / error (banner + field errors)
- Full a11y: visible labels, `aria-invalid`, `aria-describedby`, `role="alert"`

### Shared schema — `src/lib/validators/waitlist.ts`
- No directive — safe on both sides of the boundary
- Exports `waitlistSchema` (Zod object) and `WaitlistInput` (inferred type)

### Environment variables
```bash
RESEND_API_KEY=re_...                          # Resend API key
FROM_EMAIL=HelixFlow <onboarding@resend.dev>  # test-mode sender
NOTIFY_EMAIL=newportecom@gmail.com            # internal notification recipient
```
Test-mode constraint: `onboarding@resend.dev` only delivers to the Resend account email.
Production path: verify `helixflow.cloud` in Resend → switch `FROM_EMAIL` to `noreply@helixflow.cloud`.

---

## SEO / meta infrastructure

- `src/app/opengraph-image.tsx` — edge ImageResponse, 1200×630, confirmed 200
- `src/app/robots.ts` — confirmed 200
- `src/app/sitemap.ts` — confirmed 200

---

## Session notes

### 2026-03-08 — Waitlist integration + Resend smoke test + schema fix

**Completed this session:**

1. **Resend integration wired** — `waitlist.ts` rewritten with real Resend sends,
   `{ data, error }` result checking added (API-level errors now surfaced correctly).

2. **Env config updated** for test mode:
   - `FROM_EMAIL=HelixFlow <onboarding@resend.dev>`
   - `NOTIFY_EMAIL=newportecom@gmail.com`

3. **Smoke test passed** — all four test scenarios completed successfully:
   - Happy path: success state shown, both emails received
   - Validation: inline errors, no network request
   - Invalid key: error banner, terminal log
   - Missing key: local fallback success, console log

4. **Runtime error fixed** — `zodResolver` threw `"Invalid input: not a Zod schema"`
   because `waitlistSchema` was imported from the `"use server"` action file.
   **Fix:** schema moved to `src/lib/validators/waitlist.ts` (neutral shared module).
   Both `WaitlistForm.tsx` and `waitlist.ts` now import from there.
   See `NE_error_log.md` for the full entry.

**Current state:** TypeScript clean (zero errors), all routes 200, waitlist flow
end-to-end verified in test mode.

---

## Next steps

- [ ] Verify production / VPS env vars
- [ ] Run one live-domain waitlist submission
- [ ] Confirm both live emails arrive
- [ ] Migrate next-touched sections to `GlassCard` and `SectionWrapper`
- [ ] Replace remaining inline hex with `hx-*` tokens
- [ ] Replace manual stagger delays with `staggerChild(i)`
- [ ] Add navbar active-state on scroll (IntersectionObserver)
- [ ] Lighthouse / accessibility pass
- [ ] Plan `/updates` or `/blog` route

---
