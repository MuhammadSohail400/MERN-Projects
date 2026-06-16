import { supabase } from "@/integrations/supabase/client";

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_favorite: boolean;
  is_pinned: boolean;
  summary: string | null;
  created_at: string;
  updated_at: string;
};

export async function listNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Note[];
}

export async function getNote(id: string): Promise<Note | null> {
  const { data, error } = await supabase.from("notes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Note | null;
}

export async function createNote(): Promise<Note> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: userData.user.id, title: "Untitled", content: "" })
    .select("*")
    .single();
  if (error) throw error;
  return data as Note;
}

export async function updateNote(id: string, patch: Partial<Note>): Promise<void> {
  // Drop server-managed columns
  const { id: _id, user_id, created_at, updated_at, ...rest } = patch;
  void _id;
  void user_id;
  void created_at;
  void updated_at;
  const { error } = await supabase.from("notes").update(rest).eq("id", id);
  if (error) throw error;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleFavorite(id: string, value: boolean): Promise<void> {
  const { error } = await supabase.from("notes").update({ is_favorite: value }).eq("id", id);
  if (error) throw error;
}

export async function togglePin(id: string, value: boolean): Promise<void> {
  const { error } = await supabase.from("notes").update({ is_pinned: value }).eq("id", id);
  if (error) throw error;
}
