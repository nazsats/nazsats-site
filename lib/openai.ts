import "server-only";

export type GeneratedDraft = {
  title: string;
  description: string;
  tags: string[];
  body: string;
};

const systemPrompt = `You are a senior technical writer for Nazsats, a blog about AI,
machine learning, data science, blockchain, and Web3. Write a clear, accurate,
engaging blog post for a technically curious audience. Use a confident, practical
tone — no fluff, no hype. Prefer concrete examples over vague claims.

Return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "title": "string, punchy, under 70 chars",
  "description": "string, 1-2 sentence summary under 160 chars",
  "tags": ["2 to 4 short topic tags"],
  "body": "the full article in GitHub-flavored Markdown, using ## and ### headings, lists, and **bold** where helpful. Do NOT include the title as an H1 — start with an intro paragraph."
}`;

/** Generate a blog post draft from a topic using the OpenAI API. */
export async function generateDraft(topic: string): Promise<GeneratedDraft> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Write a blog post about: ${topic}` },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content) as GeneratedDraft;
  return {
    title: parsed.title || topic,
    description: parsed.description || "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    body: parsed.body || "",
  };
}
