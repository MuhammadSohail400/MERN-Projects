import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ai-tools")({
  head: () => ({ meta: [{ title: "AI Tools — StudyVault" }] }),
  component: AITools,
});

function AITools() {
  return (
    <div className="mx-auto w-full max-w-4xl p-6 md:p-10">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">
          Powered by Lovable AI
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          AI Study Tools
        </h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-card p-6">
          <div className="grid size-10 place-items-center rounded-lg bg-gold/15 text-gold">
            <Sparkles className="size-5" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold">Smart Summaries</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Open any note and tap <span className="font-semibold text-foreground">AI Summarize</span>{" "}
            to turn long-form lecture notes into a tight bullet list.
          </p>
          <Link
            to="/notes"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline"
          >
            Go to notes <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6">
          <h2 className="font-display text-xl font-semibold text-muted-foreground">
            More coming soon
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Flashcard generation, quiz mode, and auto-tagging are on the way.
          </p>
        </div>
      </div>
    </div>
  );
}
