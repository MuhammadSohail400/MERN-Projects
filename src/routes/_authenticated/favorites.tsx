import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listNotes } from "@/lib/notes";
import { NoteCard } from "@/components/NoteCard";
import { Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({ meta: [{ title: "Favorites — StudyVault" }] }),
  component: Favorites,
});

function Favorites() {
  const notesQuery = useQuery({ queryKey: ["notes"], queryFn: listNotes });
  const favorites = (notesQuery.data ?? []).filter((n) => n.is_favorite);

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Favorites</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Notes you've marked with a star.
        </p>
      </header>
      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center">
          <Star className="mx-auto size-6 text-muted-foreground/50" />
          <h3 className="mt-4 font-display text-xl font-semibold">No favorites yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the star on any note to keep it close.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}
