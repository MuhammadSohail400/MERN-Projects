import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listNotes } from "@/lib/notes";
import { NoteCard } from "@/components/NoteCard";
import { Flame, NotebookPen, BookMarked, Sparkles, ArrowRight, Plus } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — StudyVault" }] }),
  component: Dashboard,
});

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map((d) => new Date(d).toISOString().slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function Dashboard() {
  const notesQuery = useQuery({ queryKey: ["notes"], queryFn: listNotes });
  const notes = notesQuery.data ?? [];

  const stats = useMemo(() => {
    const total = notes.length;
    const catCount: Record<string, number> = {};
    for (const n of notes) catCount[n.category] = (catCount[n.category] ?? 0) + 1;
    const topCategory =
      Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const streak = computeStreak(notes.map((n) => n.updated_at));
    const favorites = notes.filter((n) => n.is_favorite).length;
    // notes per day for last 7 days
    const week: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = notes.filter((n) => n.created_at.slice(0, 10) === key).length;
      week.push({ day: d.toLocaleDateString(undefined, { weekday: "short" }), count });
    }
    return { total, topCategory, streak, favorites, week };
  }, [notes]);

  const maxWeek = Math.max(1, ...stats.week.map((w) => w.count));
  const recent = notes.slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-10">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">
          Your study desk
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Good {greeting()}, scholar.
        </h1>
        <p className="mt-2 text-muted-foreground">
          {stats.total === 0
            ? "Your vault is empty. Start with your first note."
            : `${stats.total} note${stats.total === 1 ? "" : "s"} in your vault.`}
        </p>
      </header>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total notes" value={String(stats.total)} icon={NotebookPen} />
        <StatCard
          label="Study streak"
          value={`${stats.streak} day${stats.streak === 1 ? "" : "s"}`}
          icon={Flame}
          accent
        />
        <StatCard label="Top category" value={stats.topCategory} icon={BookMarked} />
        <StatCard label="Favorites" value={String(stats.favorites)} icon={Sparkles} />
      </div>

      {/* Weekly chart */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">This week</h2>
            <p className="text-xs text-muted-foreground">Notes created per day</p>
          </div>
        </div>
        <div className="flex h-32 items-end justify-between gap-2">
          {stats.week.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-gold/40 to-gold transition-all"
                  style={{ height: `${(d.count / maxWeek) * 100}%`, minHeight: 4 }}
                />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent notes */}
      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Recent notes</h2>
            <p className="text-sm text-muted-foreground">Pick up where you left off.</p>
          </div>
          <Link
            to="/notes"
            className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {notesQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-gold/30 bg-gradient-to-br from-gold/15 to-card" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <Icon className={`size-4 ${accent ? "text-gold" : "text-muted-foreground/60"}`} />
      </div>
      <div className="mt-2 font-display text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-xl bg-gold/10 text-gold">
        <NotebookPen className="size-5" />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">Your vault is empty</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Start with your first note. We'll handle the rest.
      </p>
      <Link
        to="/notes/new"
        className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-gold-soft"
      >
        <Plus className="size-4" /> Create your first note
      </Link>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
