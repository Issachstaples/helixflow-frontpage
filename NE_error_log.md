# Newport E-commerce — Error Log

A running log of notable runtime, build, and integration errors encountered during
HelixFlow and Newport E-commerce development, along with root causes and fixes.

---

## Entry format

```
### [YYYY-MM-DD] <Error title>
**Error:** <exact message>
**File:** <file path>
**Trigger:** <code location / line>
**Root cause:** <explanation>
**Fix:** <what was changed>
**Prevention:** <rule going forward>
```

---

### [2026-03-19] Tailwind `first:` pseudo-class ineffective on component wrapper output

**Error:** No visible error — silent rendering bug (first heading always had `mt-10` top margin)  
**File:** `src/components/blog/RenderContentBlocks.tsx` / `src/components/blog/BlogPostLayout.tsx`  
**Trigger:** `first:mt-0` applied to the `h2` inside `BlockHeading`  
**Root cause:**  
Tailwind's `first:` pseudo-class targets the element when it is the `:first-child`
of its parent in the DOM. Because `renderBlock` returns the `<h2>` wrapped in a
React function component (`BlockHeading`), React renders the component's output
directly — but the `<h2>` is not literally the first child of the `prose-none`
container from the browser's perspective unless it truly is the first DOM node.
More importantly, when other block types (e.g. a `paragraph`) precede the heading
in the array, the `<h2>` is never `:first-child` and the rule never fires. Even
when the heading *is* first, the `first:` selector on the element itself does not
reliably pierce function component boundaries in all Tailwind JIT scenarios.

**Fix:**  
Removed `first:mt-0` from the `h2` in `BlockHeading`. Applied the equivalent
behaviour to the parent container in `BlogPostLayout`:

```tsx
// Before
<div className="prose-none">

// After
<div className="[&>*:first-child]:mt-0">
```

The `[&>*:first-child]` arbitrary variant correctly targets the first rendered
child of the container regardless of which block type it is.

**Prevention:**  
Do not use `first:` or `last:` on elements inside React function components when
the intent is to target their position within a dynamically-rendered list. Apply
the variant to the *parent container* using `[&>*:first-child]` / `[&>*:last-child]`
arbitrary variants instead.

---

### [2026-03-08] Invalid input: not a Zod schema

**Error:** `Invalid input: not a Zod schema`  
**File:** `src/components/sections/WaitlistForm.tsx`  
**Trigger:** `resolver: zodResolver(waitlistSchema)` inside `useForm<WaitlistInput>({...})`  
**Root cause:**  
`waitlistSchema` was imported directly from `src/app/actions/waitlist.ts`, which carries
a `"use server"` directive. Next.js marks every export from a server-action file as a
server-only reference. When the client bundle evaluated `zodResolver(waitlistSchema)`,
the schema value was an opaque server reference object rather than a real Zod schema
instance — causing `@hookform/resolvers/zod` to throw `"Invalid input: not a Zod schema"`.

**Fix:**  
Moved the shared Zod schema and its inferred type into a new neutral module:

```
src/lib/validators/waitlist.ts   ← schema lives here (no directive)
```

Updated imports in both consumers:

- `src/components/sections/WaitlistForm.tsx` — imports `waitlistSchema` and
  `WaitlistInput` from `@/lib/validators/waitlist` instead of the server action
- `src/app/actions/waitlist.ts` — imports the same schema from the shared module;
  the local `z.object({...})` definition and `import { z }` were removed

**Prevention:**  
Never import Zod schemas (or any value used by a client-side resolver) from a file
that contains a `"use server"` directive or any other server-only boundary. Keep
validation schemas in plain shared modules under `src/lib/` with no directive, so
they are safe to import on both the client and the server.

---
