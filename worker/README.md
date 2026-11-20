# AI proxy (optional)

The conversation partner works in two ways:

1. **Without this proxy (default).** Each learner pastes their own Anthropic API key on the Talk page. The key stays in their browser and they pay for their own usage.
2. **With this proxy.** Anyone can use the Talk page without a key. Your key is kept secret in a Cloudflare Worker and **you pay for everyone's usage**.

## Deploy

You need a free Cloudflare account and an Anthropic API key (console.anthropic.com).

```bash
cd worker
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # paste your key when asked
npx wrangler deploy
```

Wrangler prints the worker URL, e.g. `https://levelup-ai.<you>.workers.dev`. Put it in `js/config.js`:

```js
window.LU_CONFIG = { aiProxy: "https://levelup-ai.<you>.workers.dev", aiModel: "claude-opus-5-5" };
```

Commit and push, and the Talk page will work for every visitor.

## Keep costs under control

- **Set a monthly spend limit** in the Anthropic Console (Settings → Limits). This is the most important protection.
- Turn on the rate limit in `wrangler.toml` (for example 20 messages per minute per visitor).
- `ALLOWED_ORIGINS` restricts browsers to your site. It doesn't stop scripts that fake the header, which is why the spend limit matters.
- The proxy only allows `POST /v1/messages`, one model, at most 8,000 output tokens per reply, and adds an instruction that keeps Claude in English-practice mode.
- `MODEL` sets the model. `claude-opus-5-5` gives the best conversations. A cheaper model lowers the cost per chat.
