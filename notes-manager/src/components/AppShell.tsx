import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  NotebookPen,
  Star,
  Sparkles,
  Settings,
  Search,
  LogOut,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FocusModeWidget } from "@/components/FocusMode";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/notes", label: "My Notes", icon: NotebookPen },
  { to: "/favorites", label: "Favorites", icon: Star },
  { to: "/ai-tools", label: "AI Tools", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform md:relative md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-gold text-primary-foreground font-bold">
              S
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              StudyVault
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-2 text-muted-foreground hover:bg-sidebar-accent md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {nav.map((item) => {
            const active =
              pathname === item.to ||
              (item.to !== "/dashboard" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold/10 text-gold"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <Icon className={`size-4 ${active ? "text-gold" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <FocusModeWidget />
        </div>

        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md md:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent md:hidden"
          >
            <Menu className="size-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search your vault…"
              className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-gold/50 focus:ring-2 focus:ring-gold/15"
              onFocus={() => navigate({ to: "/notes" })}
              readOnly
            />
          </div>
          <Link
            to="/notes/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-gold px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft md:px-4"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New note</span>
          </Link>
        </header>

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
