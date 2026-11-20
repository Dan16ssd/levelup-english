/* LevelUp English — AI proxy (Cloudflare Worker).
   Lets every visitor use the conversation partner without their own API key.
   Your Anthropic key stays here as a secret and is never sent to the browser.

   What it enforces:
   - only requests from your site (ALLOWED_ORIGINS);
   - only POST /v1/messages, one model, capped output, limited conversation size;
   - a fixed instruction that keeps Claude in "English practice partner" mode;
   - optional per-visitor rate limit (RATE_LIMITER binding in wrangler.toml). */

const ALLOWED_BETAS = new Set(["server-side-fallback-2026-07-01"]);
const MAX_BODY_BYTES = 120000;
const MAX_MESSAGES = 90;
const MAX_OUTPUT = 8000;
const GUARD = "This conversation takes place on LevelUp English, a free English-practice website. You only act as an English conversation partner and teacher. If asked for anything unrelated to practising English (for example writing code, doing homework, or producing long documents), politely decline and return to conversation practice.";

function corsHeaders(origin, ok) {
  return {
    "Access-Control-Allow-Origin": ok ? origin : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
const fail = (status, message, cors) =>
  new Response(JSON.stringify({ type: "error", error: { type: "proxy_error", message } }), { status, headers: { "content-type": "application/json", ...cors } });

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const ok = allowed.includes(origin);
    const cors = corsHeaders(origin, ok);

    if (request.method === "OPTIONS") return new Response(null, { status: ok ? 204 : 403, headers: cors });
    if (!ok) return fail(403, "Origin not allowed", cors);
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/v1/messages") return fail(404, "Not found", cors);
    if (!env.ANTHROPIC_API_KEY) return fail(500, "Proxy is not configured", cors);

    if (env.RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return fail(429, "Too many requests. Wait a minute and try again.", cors);
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail(413, "Conversation too long", cors);
    let body;
    try { body = JSON.parse(raw); } catch (e) { return fail(400, "Invalid JSON", cors); }
    if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) return fail(400, "Invalid conversation", cors);

    const model = env.MODEL || "claude-opus-5-5";
    const clean = {
      model,
      max_tokens: Math.min(Number(body.max_tokens) || 1024, MAX_OUTPUT),
      system: GUARD + "\n\n" + (typeof body.system === "string" ? body.system.slice(0, 8000) : ""),
      messages: body.messages,
      stream: body.stream === true
    };
    if (body.output_config && typeof body.output_config === "object") {
      clean.output_config = {};
      if (["low", "medium"].includes(body.output_config.effort)) clean.output_config.effort = body.output_config.effort;
      if (body.output_config.format) clean.output_config.format = body.output_config.format;
    }
    if (body.fallbacks === "default") clean.fallbacks = "default";

    const betas = (request.headers.get("anthropic-beta") || "").split(",").map((s) => s.trim()).filter((b) => ALLOWED_BETAS.has(b));
    const headers = {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": request.headers.get("anthropic-version") || "2023-06-01"
    };
    if (betas.length) headers["anthropic-beta"] = betas.join(",");
    if (!betas.length) delete clean.fallbacks;

    const upstream = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers, body: JSON.stringify(clean) });
    const out = new Headers(cors);
    out.set("content-type", upstream.headers.get("content-type") || "application/json");
    for (const h of ["request-id", "retry-after"]) { const v = upstream.headers.get(h); if (v) out.set(h, v); }
    return new Response(upstream.body, { status: upstream.status, headers: out });
  }
};
