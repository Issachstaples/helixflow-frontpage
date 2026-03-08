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
