import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — StudyVault" }] }),
  component: Settings,
});

function Settings() {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6 md:p-10">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Settings</h1>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{email ?? "—"}</span>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-2 font-display text-lg font-semibold">Theme</h2>
        <p className="text-sm text-muted-foreground">
          StudyVault uses a curated charcoal-and-gold theme designed for late-night
          study sessions. A light theme is on the roadmap.
        </p>
      </section>
    </div>
  );
}
