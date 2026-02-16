import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function glassCardClassName(extra: string = "") {
  return [
    // glass look
    "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50",
    "border border-border/60",
    "shadow-sm",

    // hover polish
    "transition-transform duration-200",
    "hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md",
    "hover:ring-1 hover:ring-slate-900/10",

    // accessibility
    "motion-reduce:transform-none motion-reduce:transition-none",

    extra,
  ].join(" ");
}

export default function Home() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* LEFT: hamburger (mobile) + brand */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger on LEFT */}
            <div className="sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 7h16M4 12h16M4 17h16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-[320px] sm:w-[360px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-3">
                      <LogoMark />
                      <div className="leading-tight">
                        <div className="font-semibold">Helixflow</div>
                        <div className="text-xs text-muted-foreground">
                          A product of Newport E-commerce
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 grid gap-2">
                    {/* Keep menu items as-is */}
                    <Button variant="ghost" className="justify-start" asChild>
                      <a href="#updates">Updates</a>
                    </Button>

                    <Button variant="ghost" className="justify-start" asChild>
                      <a href="#roadmap">Roadmap</a>
                    </Button>

                    <div className="my-3 h-px bg-border" />

                    <Button asChild>
                      <a
                        href="https://app.helixflow.cloud"
                        aria-label="Open Helixflow app"
                      >
                        Launch App
                      </a>
                    </Button>

                    <Button variant="outline" asChild>
                      <a href="https://coolify.helixflow.cloud">Admin</a>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Brand */}
            <div className="flex items-center gap-2">
              <LogoMark />
              <div className="leading-tight">
                <div className="font-semibold">Helixflow</div>
                <div className="text-xs text-muted-foreground">
                  A product of Newport E-commerce
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: desktop nav */}
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <a href="#updates">Updates</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#roadmap">Roadmap</a>
            </Button>
            <Button asChild>
              <a
                href="https://app.helixflow.cloud"
                aria-label="Open Helixflow app"
              >
                Launch App
              </a>
            </Button>
          </div>

          {/* RIGHT: mobile CTA */}
          <div className="sm:hidden">
            <Button asChild size="sm">
              <a href="https://app.helixflow.cloud">App</a>
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
              Leads to delivery—then growth on autopilot.
            </h1>

            <p className="text-pretty text-lg text-muted-foreground">
              Helixflow is a lightweight, AI-assisted CRM built for agencies and
              service businesses. Turn inbound into outcomes, and outcomes into
              repeat business—inside one system.
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

          {/* Visual (hero art) */}
          <Card className={glassCardClassName("overflow-hidden")}>
            <CardHeader>
              <CardTitle>Leads → Delivery → Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border/60 bg-background/40 backdrop-blur p-2">
                <Image
                  src="/images/helixflow-hero.png"
                  alt="Helixflow hero illustration"
                  width={1536}
                  height={1152}
                  priority
                  className="h-auto w-full rounded-lg"
                />
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                A simple lifecycle: generate leads, deliver consistently, and
                turn outcomes into growth.
              </p>
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
              What Helixflow will do
            </h2>
            <p className="text-muted-foreground">
              A tight feature set that maps to your real delivery lifecycle.
            </p>
          </div>
          <Badge variant="outline">Roadmap v0</Badge>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className={glassCardClassName()}>
            <CardHeader>
              <CardTitle>Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Leads, stages, tasks, and notes that feel like a workflow — not a
              spreadsheet.
            </CardContent>
          </Card>

          <Card className={glassCardClassName()}>
            <CardHeader>
              <CardTitle>Proposals → Onboarding</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Generate proposals, collect intake, and kick off delivery with
              automations baked in.
            </CardContent>
          </Card>

          <Card className={glassCardClassName()}>
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
              body: "First Helixflow app deployment to app.helixflow.cloud.",
              tag: "Next",
            },
          ].map((u) => (
            <Card key={u.title} className={glassCardClassName()}>
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
        <Card className={glassCardClassName()}>
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
                <a href="mailto:hello@helixflow.cloud?subject=Helixflow%20Early%20Access">
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
          <div>
            © {new Date().getFullYear()} Helixflow. All rights reserved.
          </div>
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

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "relative h-9 w-9 rounded-xl border bg-background/60 backdrop-blur grid place-items-center",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/20 via-transparent to-blue-600/20" />

      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="relative text-foreground"
      >
        <path
          d="M7.2 7.4c2.6-2.2 6.9-2.2 9.6 0 2.2 1.8 1.2 4.3-1.2 5.8-1.1.7-2.4 1.3-3.8 2-1.6.8-3.1 1.6-4.1 2.6-2.2 2.1-.6 4.8 2.3 5.3 2 .4 4.2-.2 5.8-1.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M16.8 16.6c-2.6 2.2-6.9 2.2-9.6 0-2.2-1.8-1.2-4.3 1.2-5.8 1.1-.7 2.4-1.3 3.8-2 1.6-.8 3.1-1.6 4.1-2.6 2.2-2.1.6-4.8-2.3-5.3-2-.4-4.2.2-5.8 1.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
