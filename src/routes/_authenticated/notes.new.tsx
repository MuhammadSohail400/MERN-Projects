import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createNote } from "@/lib/notes";

export const Route = createFileRoute("/_authenticated/notes/new")({
  head: () => ({ meta: [{ title: "New note — StudyVault" }] }),
  component: NewNoteRedirect,
});

function NewNoteRedirect() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    createNote()
      .then((n) => {
        qc.invalidateQueries({ queryKey: ["notes"] });
        navigate({
          to: "/notes/$noteId",
          params: { noteId: n.id },
          replace: true,
        });
      })
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "Could not create note");
        navigate({ to: "/notes", replace: true });
      });
  }, [navigate, qc]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-gold" />
        Creating your note…
      </div>
    </div>
  );
}
