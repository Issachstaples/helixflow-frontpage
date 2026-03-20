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
| Automation | n8n (self-hosted at `n8n.helixflow.cloud`) |
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
- Validates with Zod `safeParse`
- POSTs JSON payload to `N8N_WAITLIST_WEBHOOK_URL`
- Payload shape: `{ name, email, company, role, submittedAt, source: "helixflow-marketing-site" }`
- Checks HTTP status + parses response body — requires `{ ok: true }` from n8n
- Missing webhook URL → typed error (no silent fallback)
- Network failure / non-OK status / bad body → typed error

### Client form — `src/components/sections/WaitlistForm.tsx`
- `"use client"` directive
- React Hook Form + `zodResolver(waitlistSchema)` — schema imported from shared validator
- `useTransition` wraps the server action call; `try/catch` handles unexpected throws
- States: idle → loading (spinner) → success (green-check, focus-managed) / error (banner + field errors)
- Full a11y: visible labels, `aria-invalid`, `aria-describedby`, `role="alert"`

### Shared schema — `src/lib/validators/waitlist.ts`
- No directive — safe on both sides of the client/server boundary
- Exports `waitlistSchema` (Zod object) and `WaitlistInput` (inferred type)

### Environment variables
```bash
N8N_WAITLIST_WEBHOOK_URL=https://n8n.helixflow.cloud/webhook/<id>
```
Required in both development and production. If missing, form returns a typed error.

### n8n workflow
- Trigger: Webhook node (POST)
- Stores signup in the HelixFlow Waitlist data table
- Responds with `{ "ok": true }` — required by the server action
- Hosted at `n8n.helixflow.cloud`

---

## SEO / meta infrastructure

- `src/app/opengraph-image.tsx` — edge ImageResponse, 1200×630, confirmed 200
- `src/app/robots.ts` — confirmed 200
- `src/app/sitemap.ts` — confirmed 200

---

## Blog system (complete — shipped 2026-03-19)

### File structure
```
src/lib/blog/articles.ts                  — data source, types, helpers
src/app/blog/page.tsx                     — /blog index (static)
src/app/blog/[slug]/page.tsx              — /blog/[slug] (static, 6 routes)
src/components/blog/BlogNavbar.tsx        — sticky top bar (showBack prop)
src/components/blog/BlogPostLayout.tsx    — post template
src/components/blog/RenderContentBlocks.tsx — shared block renderer
src/components/blog/BlogIndexCard.tsx     — article grid card
```

### Route map
```
/blog                                      → BlogIndexPage
/blog/ai-crm-for-agencies                 → BlogPostPage
/blog/lead-to-delivery-workflow           → BlogPostPage
/blog/crm-vs-spreadsheets-service-business → BlogPostPage
/blog/proposal-automation-agencies        → BlogPostPage
/blog/ai-summaries-followups              → BlogPostPage
/blog/crm-buying-guide-service-business   → BlogPostPage
/blog/<unknown>                           → notFound() → 404
```

### ContentBlock type
```ts
export type ContentBlock =
  | { type: "heading";   text: string }
  | { type: "paragraph"; text: string }
  | { type: "list";      items: string[] }
  | { type: "callout";   title?: string; text: string }
  | { type: "quote";     text: string; attribution?: string };
```
Discriminated union — exhaustive switch in `renderBlock`, no non-null assertions.

### Metadata (per article)
`title`, `description`, `openGraph` (type `article`, `publishedTime` ISO 8601,
`tags`), `twitter`, `alternates.canonical`. Falls back `metaDescription → excerpt`.

### CMS migration path
All content is in `articles.ts`. Replace `ARTICLES` with a `fetch()`. The
`Article` type is the shared contract — no layout or renderer changes needed.

---

## Session notes

### 2026-03-19 — Blog system implementation, refactor, and QA pass

**Completed this session:**

1. **Blog system built** — `/blog` index, 6 static article routes, `BlogNavbar`,
   `BlogPostLayout`, `RenderContentBlocks`, `BlogIndexCard`. All routes resolve;
   unknown slugs return 404.

2. **ContentBlock upgraded to discriminated union** — replaced interface-with-optionals.
   All 6 callout blocks updated (`label:` → `title:`). `BlockType` union removed.
   Renderer switch is now exhaustive with zero non-null assertions.

3. **Components extracted** — `RenderContentBlocks.tsx` and `BlogIndexCard.tsx`
   separated from inline code in `BlogPostLayout` and `blog/page.tsx`.

4. **QA pass** — 4 bugs found and fixed:
   - `ArticleCTA <aside>` missing `relative` (absolute accent line escaped container)
   - `BlogNavbar` logo/back links were plain `<a>` for internal routes → `<Link>`
   - OG `publishedTime` was bare date string → full ISO 8601
   - `first:mt-0` on `h2` unreachable via Tailwind `first:` → moved to parent `[&>*:first-child]:mt-0`

5. **ArticlePreviews** on homepage — all 4 `<a href>` upgraded to `<Link>`.

**Commits:** `816fdb4`, `6a92886`, `3db1cd6`
**Current state:** TypeScript clean, all routes verified, pushed to `main` on GitHub.

---

### 2026-03-08 — n8n webhook migration + production wiring

**Completed this session:**

1. **Migrated waitlist flow from Resend to n8n webhook** — `waitlist.ts` rewritten to
   POST to `N8N_WAITLIST_WEBHOOK_URL`. All Resend SDK code and env vars removed.

2. **n8n workflow verified end-to-end locally** — webhook stores signup in HelixFlow
   Waitlist data table and returns `{ "ok": true }`. Form shows success state correctly.

3. **Production wiring** — debug logs removed, dead `CTAAction` interface and
   `CTA_ACTIONS` / `PrimaryButton` / `SecondaryButton` dead code purged from
   `CTABanner.tsx`. Server action is now production-ready.

4. **Env var simplified** — only `N8N_WAITLIST_WEBHOOK_URL` required. `.env.example`
   and `context_anchor.md` updated to reflect current architecture.

**Current state:** TypeScript clean, no dead code, no dev-only assumptions.
Ready for live deployment — add `N8N_WAITLIST_WEBHOOK_URL` to Coolify env vars and redeploy.

---

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

- [ ] Add `N8N_WAITLIST_WEBHOOK_URL` to Coolify env vars and redeploy
- [ ] Run one live-domain waitlist submission to confirm end-to-end on production
- [ ] Migrate next-touched sections to `GlassCard` and `SectionWrapper`
- [ ] Replace remaining inline hex with `hx-*` tokens
- [ ] Replace manual stagger delays with `staggerChild(i)`
- [ ] Add navbar active-state on scroll (IntersectionObserver)
- [ ] Lighthouse / accessibility pass
- [x] ~~Plan `/updates` or `/blog` route~~ — blog system shipped (2026-03-19)

---
