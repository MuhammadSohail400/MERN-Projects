import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, X, Maximize2 } from "lucide-react";

const POMODORO_SECONDS = 25 * 60;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function useFocusTimer() {
  const [seconds, setSeconds] = useState(POMODORO_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          if (typeof window !== "undefined") {
            try {
              new Audio(
                "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
              ).play();
            } catch {
              /* ignore */
            }
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return {
    seconds,
    running,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    reset: () => {
      setRunning(false);
      setSeconds(POMODORO_SECONDS);
    },
    label: fmt(seconds),
    progress: 1 - seconds / POMODORO_SECONDS,
  };
}

export function FocusModeWidget() {
  const t = useFocusTimer();
  return (
    <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-card to-canvas p-4 shadow-xl shadow-gold/5">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gold/70">
        Focus session
      </div>
      <div className="mb-4 font-display text-3xl font-bold tabular-nums text-foreground">
        {t.label}
      </div>
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-accent">
        <div
          className="h-full bg-gold transition-all"
          style={{ width: `${t.progress * 100}%` }}
        />
      </div>
      <div className="flex gap-2">
        {t.running ? (
          <button
            onClick={t.pause}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold-soft"
          >
            <Pause className="size-3" /> Pause
          </button>
        ) : (
          <button
            onClick={t.start}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold-soft"
          >
            <Play className="size-3" /> Start
          </button>
        )}
        <button
          onClick={t.reset}
          className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          aria-label="Reset"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function FocusModeOverlay({
  title,
  content,
  onClose,
}: {
  title: string;
  content: string;
  onClose: () => void;
}) {
  const t = useFocusTimer();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-gold/70">
          Focus mode
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono text-lg font-bold tabular-nums text-foreground">
            {t.label}
          </div>
          {t.running ? (
            <button
              onClick={t.pause}
              className="grid size-9 place-items-center rounded-full bg-gold text-primary-foreground"
            >
              <Pause className="size-4" />
            </button>
          ) : (
            <button
              onClick={t.start}
              className="grid size-9 place-items-center rounded-full bg-gold text-primary-foreground"
            >
              <Play className="size-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <article className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-foreground/90">
            {content || "(empty note)"}
          </div>
        </article>
      </div>
    </div>
  );
}

export function FocusModeButton({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-gold/40"
      >
        <Maximize2 className="size-3.5" /> Focus mode
      </button>
      {open && (
        <FocusModeOverlay title={title} content={content} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
