// Server-only helper for Lovable AI Gateway.
// Direct HTTP call via fetch — we don't need the full AI SDK for a single summarize endpoint.

export async function summarizeWithLovableAI(
  apiKey: string,
  text: string,
): Promise<string> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a study assistant. Summarize the student's note into 3–5 short bullet points capturing the key concepts. Be concise, no preamble. Return plain text bullets starting with '• '.",
        },
        { role: "user", content: text },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 429) {
      throw new Error("AI is busy right now. Try again in a moment.");
    }
    if (response.status === 402) {
      throw new Error("AI credits exhausted. Add credits to keep summarizing.");
    }
    throw new Error(`AI Gateway error (${response.status}): ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No summary returned");
  return content.trim();
}
