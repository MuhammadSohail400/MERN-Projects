import { Link } from "@tanstack/react-router";
import { Star, Pin } from "lucide-react";
import type { Note } from "@/lib/notes";

const CATEGORY_HUE: Record<string, string> = {
  "Computer Science": "bg-blue-500/10 text-blue-300",
  Math: "bg-violet-500/10 text-violet-300",
  Mathematics: "bg-violet-500/10 text-violet-300",
  English: "bg-rose-500/10 text-rose-300",
  History: "bg-amber-500/10 text-amber-300",
  Science: "bg-emerald-500/10 text-emerald-300",
  Philosophy: "bg-orange-500/10 text-orange-300",
};

export function NoteCard({ note }: { note: Note }) {
  const catClass = CATEGORY_HUE[note.category] ?? "bg-gold/10 text-gold";
  return (
    <Link
      to="/notes/$noteId"
      params={{ noteId: note.id }}
      className="group block rounded-2xl border border-border bg-card p-6 transition-all hover:border-gold/40 hover:shadow-xl hover:shadow-gold/5"
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${catClass}`}
        >
          {note.category}
        </span>
        <div className="flex items-center gap-1.5">
          {note.is_pinned && <Pin className="size-3.5 fill-gold text-gold" />}
          <Star
            className={`size-3.5 ${
              note.is_favorite ? "fill-gold text-gold" : "text-muted-foreground/50"
            }`}
          />
        </div>
      </div>
      <h3 className="mb-3 line-clamp-2 font-display text-xl font-semibold leading-tight text-foreground">
        {note.title || "Untitled"}
      </h3>
      <p className="mb-6 line-clamp-3 text-sm text-muted-foreground">
        {note.content || "No content yet."}
      </p>
      <div className="flex items-center justify-between border-t border-border/60 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] text-muted-foreground">
              #{t}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {new Date(note.updated_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
