# Random colour Cloudflare Worker.

Last updated: September 17, 2026.

## Development environment

Use Node.js 26.10.0 and pnpm 12.6.0, pinned in `.tool-versions` and `package.json`.
Run `pnpm install --frozen-lockfile`, then `pnpm exec wrangler deploy --dry-run`
for a local packaging check. The original production deployment workflow runs on pushes to `main`.
The separate Public checks workflow performs packaging checks without deploying.
