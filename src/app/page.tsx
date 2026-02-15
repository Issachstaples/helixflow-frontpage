import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl border bg-muted" />
            <div className="leading-tight">
              <div className="font-semibold">HelixFlow</div>
              <div className="text-xs text-muted-foreground">
                A product of Newport E-commerce
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <a href="#updates">Updates</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#roadmap">Roadmap</a>
            </Button>
            <Button asChild>
              <a href="https://app.helixflow.cloud" aria-label="Open HelixFlow app">
                Launch App
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <Badge variant="secondary">Coming soon</Badge>

            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Run your agency like a system — not a scramble.
            </h1>

            <p className="text-pretty text-lg text-muted-foreground">
              HelixFlow is a lightweight, AI-assisted CRM built for agencies and
              service businesses: leads → proposals → onboarding → delivery →
              follow-up — all in one flow.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href="#get-started">Get Early Access</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#roadmap">View Roadmap</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>Next.js</span>
              <span>•</span>
              <span>Tailwind</span>
              <span>•</span>
              <span>shadcn/ui</span>
              <span>•</span>
              <span>Prismic CMS</span>
            </div>
          </div>

          {/* Visual placeholder */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="h-10 rounded-lg border bg-muted" />
                <div className="h-28 rounded-lg border bg-muted" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-24 rounded-lg border bg-muted" />
                  <div className="h-24 rounded-lg border bg-muted" />
                </div>
                <div className="h-24 rounded-lg border bg-muted" />
                <p className="text-sm text-muted-foreground">
                  This space will become the live HelixFlow UI preview (or a
                  product screenshot) once the app is deployed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-14" id="roadmap">
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              What HelixFlow will do
            </h2>
            <p className="text-muted-foreground">
              A tight feature set that maps to your real delivery lifecycle.
            </p>
          </div>
          <Badge variant="outline">Roadmap v0</Badge>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Leads, stages, tasks, and notes that feel like a workflow — not a
              spreadsheet.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposals → Onboarding</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Generate proposals, collect intake, and kick off delivery with
              automations baked in.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Assist</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Summaries, follow-ups, meeting notes, and client-ready updates —
              consistently on brand.
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Updates (Prismic-ready) */}
      <section className="mx-auto max-w-6xl px-4 py-14" id="updates">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Updates</h2>
          <p className="text-muted-foreground">
            This section will be powered by Prismic so you can post “Coming soon”
            updates without touching code.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Infrastructure online",
              body: "VPS + Coolify + HTTPS configured. Deploy pipeline ready.",
              tag: "Live",
            },
            {
              title: "Frontpage v1",
              body: "Next.js + shadcn/ui landing page with CMS-ready updates.",
              tag: "Now",
            },
            {
              title: "App shell next",
              body: "First HelixFlow app deployment to app.helixflow.cloud.",
              tag: "Next",
            },
          ].map((u) => (
            <Card key={u.title}>
              <CardHeader className="flex-row items-start justify-between gap-3">
                <CardTitle className="text-base">{u.title}</CardTitle>
                <Badge variant="secondary">{u.tag}</Badge>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {u.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14" id="get-started">
        <Card>
          <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Want early access?
              </h2>
              <p className="text-muted-foreground">
                Join the list and we’ll notify you when the first beta opens.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href="mailto:hello@helixflow.cloud?subject=HelixFlow%20Early%20Access">
                  Request early access
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://coolify.helixflow.cloud">Admin</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} HelixFlow. All rights reserved.</div>
          <div className="flex gap-4">
            <a className="hover:underline" href="#updates">
              Updates
            </a>
            <a className="hover:underline" href="#roadmap">
              Roadmap
            </a>
            <a className="hover:underline" href="https://newportecom.com">
              Newport E-commerce
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
