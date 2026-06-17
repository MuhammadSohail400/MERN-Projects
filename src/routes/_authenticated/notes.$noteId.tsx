import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  createNote,
  deleteNote,
  getNote,
  toggleFavorite,
  togglePin,
  updateNote,
  type Note,
} from "@/lib/notes";
import { summarizeNote } from "@/lib/notes.functions";
import { toast } from "sonner";
import { FocusModeButton } from "@/components/FocusMode";
import {
  ArrowLeft,
  Star,
  Pin,
  Trash2,
  Sparkles,
  Loader2,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/notes/$noteId")({
  head: () => ({ meta: [{ title: "Note — StudyVault" }] }),
  component: NoteEditorPage,
});

const CATEGORY_OPTIONS = [
  "General",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Philosophy",
  "Economics",
];

function NoteEditorPage() {
  const { noteId } = Route.useParams();

  const noteQuery = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNote(noteId),
  });

  if (noteQuery.isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-gold" />
      </div>
    );
  }
  if (!noteQuery.data) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-muted-foreground">
        Note not found.
      </div>
    );
  }

  return <Editor initial={noteQuery.data} />;
}


function Editor({ initial }: { initial: Note }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [category, setCategory] = useState(initial.category);
  const [tagsInput, setTagsInput] = useState(initial.tags.join(", "));
  const [favorite, setFavorite] = useState(initial.is_favorite);
  const [pinned, setPinned] = useState(initial.is_pinned);
  const [summary, setSummary] = useState(initial.summary);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const summarizeFn = useServerFn(summarizeNote);

  // Autosave: debounce 700ms
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setSaveState("saving");
    saveTimeout.current = setTimeout(async () => {
      try {
        await updateNote(initial.id, {
          title: title.trim() || "Untitled",
          content,
          category,
          tags: tagsInput
            .split(",")
            .map((t) => t.trim().replace(/^#/, ""))
            .filter(Boolean),
        });
        setSaveState("saved");
        qc.invalidateQueries({ queryKey: ["notes"] });
      } catch (e) {
        setSaveState("idle");
        toast.error(e instanceof Error ? e.message : "Could not save");
      }
    }, 700);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, category, tagsInput]);

  const summarizeMutation = useMutation({
    mutationFn: async () => {
      // Ensure latest content is saved first
      await updateNote(initial.id, { content });
      const res = await summarizeFn({ data: { noteId: initial.id } });
      return res.summary;
    },
    onSuccess: (s) => {
      setSummary(s);
      qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Summary ready");
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Could not summarize");
    },
  });

  async function onToggleFavorite() {
    const next = !favorite;
    setFavorite(next);
    try {
      await toggleFavorite(initial.id, next);
      qc.invalidateQueries({ queryKey: ["notes"] });
    } catch {
      setFavorite(!next);
    }
  }
  async function onTogglePin() {
    const next = !pinned;
    setPinned(next);
    try {
      await togglePin(initial.id, next);
      qc.invalidateQueries({ queryKey: ["notes"] });
    } catch {
      setPinned(!next);
    }
  }
  async function onDelete() {
    if (!confirm("Delete this note? This can't be undone.")) return;
    try {
      await deleteNote(initial.id);
      qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
      navigate({ to: "/notes" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6 md:p-10">
      <div className="mb-6 flex items-center justify-between gap-2">
        <button
          onClick={() => navigate({ to: "/notes" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All notes
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saveState === "saving" && (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="size-3 animate-spin" /> Saving…
            </span>
          )}
          {saveState === "saved" && (
            <span className="inline-flex items-center gap-1 text-gold">
              <Check className="size-3" /> Saved
            </span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-tighter text-gold outline-none focus:ring-2 focus:ring-gold/20"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={onTogglePin}
          className={`grid size-9 place-items-center rounded-md border transition-colors ${
            pinned
              ? "border-gold/40 bg-gold/10 text-gold"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Pin className={`size-4 ${pinned ? "fill-gold" : ""}`} />
        </button>
        <button
          onClick={onToggleFavorite}
          className={`grid size-9 place-items-center rounded-md border transition-colors ${
            favorite
              ? "border-gold/40 bg-gold/10 text-gold"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star className={`size-4 ${favorite ? "fill-gold" : ""}`} />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <FocusModeButton title={title || "Untitled"} content={content} />
          <button
            onClick={() => summarizeMutation.mutate()}
            disabled={summarizeMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-gold px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
          >
            {summarizeMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            AI Summarize
          </button>
          <button
            onClick={onDelete}
            className="grid size-9 place-items-center rounded-md border border-border bg-card text-muted-foreground hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {summary && (
        <div className="mb-6 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-card p-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
            <Sparkles className="size-3.5" /> AI summary
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
            {summary}
          </pre>
        </div>
      )}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="w-full bg-transparent font-display text-4xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40 md:text-5xl"
      />

      <input
        type="text"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        placeholder="tags, comma separated"
        className="mt-3 w-full bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/50"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your note…"
        className="mt-6 min-h-[60vh] w-full resize-none bg-transparent font-serif text-lg leading-relaxed text-foreground/90 outline-none placeholder:text-muted-foreground/40"
      />
    </div>
  );
}
