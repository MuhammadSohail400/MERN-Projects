import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const summarizeInput = z.object({
  noteId: z.string().uuid(),
});

export const summarizeNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => summarizeInput.parse(input))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured for this project.");

    const { data: note, error } = await context.supabase
      .from("notes")
      .select("id, title, content")
      .eq("id", data.noteId)
      .single();
    if (error || !note) throw new Error("Note not found");

    const body = `Title: ${note.title}\n\n${note.content}`.slice(0, 12000);
    if (body.trim().length < 30) {
      throw new Error("Add more content before summarizing.");
    }

    const { summarizeWithLovableAI } = await import("./ai-gateway.server");
    const summary = await summarizeWithLovableAI(apiKey, body);

    const { error: updateError } = await context.supabase
      .from("notes")
      .update({ summary })
      .eq("id", note.id);
    if (updateError) throw updateError;

    return { summary };
  });
