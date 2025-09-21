## 80 — Cloudflare Workers random color page

This is a minimal Cloudflare Worker that serves a single HTML page which shows a random color on each click. The worker returns the same HTML for any path; the randomness is produced in the client by inline JavaScript.

### Run locally

- Requirements: Node >= 22, pnpm, Wrangler 4 (installed via devDeps)
- Commands:
  - `pnpm install`
  - `pnpm dev` — starts local dev server via Wrangler
  - `pnpm deploy` — deploys to Cloudflare Workers
  - `pnpm typecheck` — TypeScript type-check only

### CI/CD (GitHub Actions)

- Workflow: `.github/workflows/deploy.yml`
- Triggers on push to `main`.
- Steps: checkout → setup Node (with pnpm cache) → install deps → typecheck → deploy.
- Required GitHub Secrets:
  - `CLOUDFLARE_API_TOKEN` — API token with permission to deploy Workers (e.g., `Account:Workers Scripts:Edit`).
  - `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account identifier (recommended for explicit binding).

### Project structure

- `src/index.ts` — Worker entry; serves the HTML response, with sane security and cache headers.
- `src/index.html` — The HTML page imported as a text module.
- `wrangler.toml` — Wrangler config; restricts text-module rule to `src/index.html`.

### Notes

- The Worker only allows `GET` and `HEAD`. Other methods return `405` with `Allow: GET, HEAD`.
- Caching is disabled (`Cache-Control: no-store`) to avoid stale content.
- Basic security headers are set, including a CSP that allows inline script/style and `data:` image for favicon drawing.

### Development tips

- To update Cloudflare runtime types: `pnpm cf-typegen`.
- If you prefer stricter CSP without inline scripts, move the script out of the HTML and add a hash/nonce (not done here to preserve current behavior).

