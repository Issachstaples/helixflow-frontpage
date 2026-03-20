# HelixFlow v2 — Site Changes Log

A rolling log of implementation changes, integrations, and fixes to the
HelixFlow marketing site (`helixflow-frontpage`). Ordered newest-first.

---

## [2026-03-19] Blog system implementation, refactor, and QA pass

### Added
- `src/lib/blog/articles.ts` — typed local article data source; 6 full articles;
  `ContentBlock` discriminated union; `Article` interface; `getArticleBySlug`,
  `getAllSlugs`, `formatDate` helpers
- `src/app/blog/page.tsx` — `/blog` index: featured card + 5-card grid, full SEO metadata
- `src/app/blog/[slug]/page.tsx` — dynamic post route: `generateStaticParams` (6 slugs),
  `generateMetadata` (title, description, OG `article:*`, Twitter, canonical), `notFound()`
- `src/components/blog/BlogNavbar.tsx` — sticky blog top bar (`showBack` prop)
- `src/components/blog/BlogPostLayout.tsx` — post template (header, excerpt, body, CTA)
- `src/components/blog/RenderContentBlocks.tsx` — shared block renderer; exhaustive
  discriminated union switch; exports `renderBlock` + default `<RenderContentBlocks>`
- `src/components/blog/BlogIndexCard.tsx` — extracted article grid card component

### Changed
- `src/components/sections/ArticlePreviews.tsx` — all 4 `<a href>` tags upgraded to
  `<Link>` for Next.js prefetch (2 article cards + 2 CTA buttons)
- `src/components/blog/BlogNavbar.tsx` — logo and back-link converted from `<a>` to
  `<Link>`; `Get started` (hash anchor) left as `<a>`

### Fixed
- `ArticleCTA` `<aside>` missing `relative` — absolute-positioned top accent line
  would escape its container
- OG `publishedTime` was a bare date string (`YYYY-MM-DD`); wrapped with
  `new Date(article.publishedAt).toISOString()` for full RFC 3339 compliance
- `first:mt-0` on `BlockHeading` `h2` was unreachable via Tailwind's `first:`
  pseudo-class (targets DOM siblings, not component wrappers); moved to
  `[&>*:first-child]:mt-0` on the body container in `BlogPostLayout`

### Content model — `ContentBlock` discriminated union
```ts
export type ContentBlock =
  | { type: "heading";   text: string }
  | { type: "paragraph"; text: string }
  | { type: "list";      items: string[] }
  | { type: "callout";   title?: string; text: string }
  | { type: "quote";     text: string; attribution?: string };
```
All 6 callout blocks updated: `label:` → `title:`. `BlockType` union export removed.
No non-null assertions anywhere in the renderer — type narrowing is exhaustive.

### Route map
```
/blog                                → BlogIndexPage (static)
/blog/ai-crm-for-agencies            → BlogPostPage (static)
/blog/lead-to-delivery-workflow      → BlogPostPage (static)
/blog/crm-vs-spreadsheets-service-business → BlogPostPage (static)
/blog/proposal-automation-agencies   → BlogPostPage (static)
/blog/ai-summaries-followups         → BlogPostPage (static)
/blog/crm-buying-guide-service-business    → BlogPostPage (static)
/blog/<unknown>                      → notFound() → 404
```

### CMS migration path
All article data is isolated in `src/lib/blog/articles.ts`. To migrate to a CMS:
1. Replace `ARTICLES` with a `fetch()` call in a server component
2. Keep the `Article` type as the shared contract
3. `BlogPostLayout`, `RenderContentBlocks`, `BlogIndexCard`, `BlogNavbar` — no changes needed

### Verified
- TypeScript: zero errors (`npx tsc --noEmit`)
- All 6 routes resolve, unknown slugs return 404
- All homepage article links match real slugs
- OG metadata confirmed on all 6 article pages

### Commits
- `816fdb4` — `feat: blog system — article data, index page, post template, 6 static routes`
- `6a92886` — `refactor: blog — discriminated union ContentBlock, extract RenderContentBlocks and BlogIndexCard`
- `3db1cd6` — `fix: blog QA pass — aside relative, BlogNavbar Link, OG publishedTime ISO, first heading margin`

---

## [2026-03-08] Waitlist flow integration, Resend wiring, schema fix

### Added
- `src/lib/validators/waitlist.ts` — shared Zod schema and `WaitlistInput` type,
  neutral module (no directive) safe for client and server import
- `src/components/sections/WaitlistForm.tsx` — full waitlist signup form:
  React Hook Form + Zod resolver, all four UX states (idle / loading / success / error),
  complete a11y (labels, `aria-invalid`, `aria-describedby`, focus management)
- `src/app/actions/waitlist.ts` — server action: Zod validation, two concurrent
  Resend sends (internal notification + user confirmation), `{ data, error }` result
  checking, graceful no-key fallback
- `src/components/sections/CTABanner.tsx` — wired to render `WaitlistForm`
- `.env.local` / `.env.example` — documented test-mode and production env vars

### Fixed
- **`zodResolver` runtime error** (`Invalid input: not a Zod schema`):
  `waitlistSchema` was imported from the `"use server"` action file into the client
  form, making it arrive as an opaque server reference at runtime.
  Moved schema to `src/lib/validators/waitlist.ts`; updated imports in both consumers.
  See `NE_error_log.md — [2026-03-08]` for full details.
- **Resend API-level errors not surfaced**: original `try/catch` only caught network
  failures. Added explicit `{ data, error }` destructuring from `Promise.all` results
  so Resend API rejections (bad key, test-mode restrictions) surface as typed errors.

### Infrastructure
- `src/app/opengraph-image.tsx` — edge ImageResponse (1200×630), Satori bugs fixed
- `src/app/robots.ts` — `/robots.txt` → 200
- `src/app/sitemap.ts` — `/sitemap.xml` → 200

### Verified
- TypeScript: zero errors (`npx tsc --noEmit`)
- Smoke test: all four scenarios passed (happy path, validation, invalid key, missing key)

---

## [2026-03-07] Homepage assembly + hardening pass

### Added
- `src/components/primitives/GlassCard.tsx` — polymorphic glass-morphism surface,
  3 variants (`default`, `strong`, `subtle`)
- `src/components/primitives/SectionWrapper.tsx` — shared section shell,
  3 width variants (`wide`, `narrow`, `full`)
- `src/components/primitives/LogoMark.tsx` — extracted SVG logomark
- `src/components/primitives/AnimateIn.tsx` — scroll-entrance wrapper
- `src/components/layout/Navbar.tsx` — site navigation
- `src/components/layout/SiteFooter.tsx` — site footer
- `src/lib/motion.ts` — Framer Motion variants; `staggerChild(i)` helper added
- `tailwind.config.ts` — `hx.*` colour palette (10 tokens); legacy `helix.*` kept

### Changed
- `src/app/page.tsx` — rewritten as clean 59-line server component composition
- `src/app/globals.css` — background locked to `#060D1A`, smooth scroll, `color-scheme: dark`
- `src/components/sections/ArticlePreviews.tsx` — `"use client"` removed
- `src/components/sections/RoadmapStatus.tsx` — `"use client"` removed

### Sections completed
Hero, LifecycleRibbon, ModuleGrid, StickyStoryboard, AudienceFit,
ArticlePreviews, FAQ, RoadmapStatus, CTABanner

---
