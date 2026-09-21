/**
 * Free-input analysis proxy.
 *
 * The game is a static site -- `render.yaml` says `runtime: static`, and
 * `telemetry.js` talks to Supabase REST with the anon key straight from the
 * browser. There is no server to put an Anthropic key behind, so this function
 * is the server: it holds the key as a Supabase secret and the client never
 * sees it.
 *
 * Deploy:
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 *   supabase functions deploy analyze-free-text
 */

import { buildUserMessage, SYSTEM_PROMPT } from "./prompt.js";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
// Model ids are complete without a date suffix. Haiku is the cheapest tier and
// this is a short classification, but the choice is a cost decision, not a
// technical one -- `claude-sonnet-5` and `claude-opus-5` drop in unchanged.
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 700;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (request.method !== "POST") return jsonResponse({ error: "method-not-allowed" }, 405);
  if (!ANTHROPIC_API_KEY) return jsonResponse({ error: "not-configured" }, 503);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "bad-json" }, 400);
  }
  if (!String(body.player_input ?? "").trim()) {
    return jsonResponse({ error: "empty-input" }, 400);
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        // No assistant prefill. It would work on Haiku and cost one token, but
        // it returns a 400 on Sonnet 5, Opus 5 and the whole 4.6+ family, which
        // would turn a one-word model swap into an outage. The client's parser
        // survives a preamble instead.
        messages: [{ role: "user", content: buildUserMessage(body) }],
      }),
    });

    if (!upstream.ok) {
      return jsonResponse({ error: "upstream", status: upstream.status }, 502);
    }
    const payload = await upstream.json();
    const text = Array.isArray(payload?.content)
      ? payload.content.filter((part: { type: string }) => part.type === "text").map((part: { text: string }) => part.text).join("")
      : "";
    return jsonResponse({ content: text });
  } catch {
    return jsonResponse({ error: "upstream-unreachable" }, 502);
  }
});
