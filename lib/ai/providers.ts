export type LLMRequest = {
  model?: string;
  messages: { role: "user" | "assistant" | "system"; content: string }[];
};

export type LLMResponse = { text: string };

const baseHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function openai(req: LLMRequest): Promise<LLMResponse> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");

  const model = req.model || process.env.LLM_MODEL || "gpt-4o-mini";
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: baseHeaders(key),
    body: JSON.stringify({ model, messages: req.messages }),
  });

  if (!r.ok) {
    throw new Error(`OpenAI API error: ${r.status} ${r.statusText}`);
  }

  const j = await r.json();
  return { text: j.choices?.[0]?.message?.content ?? "" };
}

export async function gemini(req: LLMRequest): Promise<LLMResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not configured");

  const model =
    (req.model || process.env.LLM_MODEL || "gemini-1.5-flash").replace(
      "gemini-",
      "models/gemini-"
    );

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: req.messages.map((m) => ({
              text: `${m.role}: ${m.content}`,
            })),
          },
        ],
      }),
    }
  );

  if (!r.ok) {
    throw new Error(`Gemini API error: ${r.status} ${r.statusText}`);
  }

  const j = await r.json();
  const text =
    j.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
  return { text };
}

export async function openrouter(req: LLMRequest): Promise<LLMResponse> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not configured");

  const model =
    req.model ||
    process.env.LLM_MODEL ||
    "openrouter/anthropic/claude-3.5-sonnet";

  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      ...baseHeaders(key),
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "",
      "X-Title": "SubSensei",
    },
    body: JSON.stringify({ model, messages: req.messages }),
  });

  if (!r.ok) {
    throw new Error(`OpenRouter API error: ${r.status} ${r.statusText}`);
  }

  const j = await r.json();
  return { text: j.choices?.[0]?.message?.content ?? "" };
}

export async function deepseek(req: LLMRequest): Promise<LLMResponse> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("DEEPSEEK_API_KEY not configured");

  const model = req.model || process.env.LLM_MODEL || "deepseek-chat";

  const r = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: baseHeaders(key),
    body: JSON.stringify({ model, messages: req.messages }),
  });

  if (!r.ok) {
    throw new Error(`DeepSeek API error: ${r.status} ${r.statusText}`);
  }

  const j = await r.json();
  return { text: j.choices?.[0]?.message?.content ?? "" };
}

export async function llm(req: LLMRequest): Promise<LLMResponse> {
  const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase();

  try {
    switch (provider) {
      case "gemini":
        return await gemini(req);
      case "openrouter":
        return await openrouter(req);
      case "deepseek":
        return await deepseek(req);
      case "openai":
      default:
        return await openai(req);
    }
  } catch (error: any) {
    console.error(`LLM provider ${provider} error:`, error.message);
    throw error;
  }
}
