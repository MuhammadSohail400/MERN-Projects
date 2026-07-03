import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Sparkles, Timer, Search, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyVault — Organize your study life, smartly" },
      {
        name: "description",
        content:
          "A calm, beautiful home for your notes. Capture, organize, summarize with AI, and stay focused.",
      },
      { property: "og:title", content: "StudyVault — Organize your study life" },
      {
        property: "og:description",
        content:
          "A calm, beautiful home for your notes. Capture, organize, summarize with AI, and stay focused.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-gold text-primary-foreground font-bold">
              S
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              StudyVault
            </span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#workflow" className="text-sm text-muted-foreground hover:text-foreground">
              Workflow
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex items-center gap-1.5 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
            >
              Get started
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_-10%,oklch(0.78_0.13_80/0.18),transparent_50%),radial-gradient(circle_at_80%_10%,oklch(0.65_0.12_200/0.10),transparent_50%)]" />
        <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center md:pt-32">
          <div className="animate-fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-gold" />
            Built for late-night studying
          </div>
          <h1 className="animate-fade-up mt-6 font-display text-5xl font-semibold tracking-tight md:text-7xl">
            Organize your{" "}
            <span className="italic shimmer-gold">study life</span>,
            <br className="hidden md:block" /> smartly.
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            StudyVault is a calm, focused notes home for students. Capture lectures,
            organize by subject, summarize with AI, and stay in flow.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02] hover:bg-gold-soft"
            >
              Create your vault
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              I have an account
            </Link>
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="mx-auto max-w-5xl px-6 pb-24">
          <div className="ring-gold rounded-2xl border border-border bg-card/60 p-2 backdrop-blur">
            <div className="rounded-xl border border-border bg-canvas p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg italic text-foreground/80">
                  Good evening, scholar.
                </span>
                <span className="rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
                  12-day streak
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { c: "Organic Chemistry", t: "Electrophilic Substitution" },
                  { c: "History", t: "Silk Road Economies" },
                  { c: "Philosophy", t: "Kant vs Utilitarianism" },
                ].map((n) => (
                  <div
                    key={n.t}
                    className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-gold/40"
                  >
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-tighter text-gold">
                      {n.c}
                    </div>
                    <div className="font-display text-base font-semibold leading-tight">
                      {n.t}
                    </div>
                    <div className="mt-4 h-1 w-full rounded-full bg-accent">
                      <div className="h-full w-1/2 rounded-full bg-gold/60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              What you get
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
              Everything you need. Nothing you don't.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {[
              {
                icon: BookMarked,
                title: "Capture without friction",
                body: "A clean editor that gets out of your way. Categories, tags, pins, and favorites included.",
              },
              {
                icon: Sparkles,
                title: "AI summarizer",
                body: "Turn a wall of lecture notes into a tight study summary in one click.",
              },
              {
                icon: Search,
                title: "Instant search",
                body: "Live-filter every note by title, content, or tag. Find anything in seconds.",
              },
              {
                icon: Timer,
                title: "Focus mode",
                body: "Full-screen distraction-free reading with a built-in Pomodoro timer.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-background p-8">
                <div className="grid size-10 place-items-center rounded-lg bg-gold/10 text-gold">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="workflow" className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Your best semester starts with{" "}
            <span className="italic text-gold">one note.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
            Free to start. Sign up with email, write your first note in under a minute.
          </p>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="mt-10 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02] hover:bg-gold-soft"
          >
            Open StudyVault
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StudyVault. Made for students.
        </div>
      </footer>
    </div>
  );
}
