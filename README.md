# Random colour Cloudflare Worker.

Last updated: September 17, 2026.

## Development environment

Use Node.js 26.10.0 and pnpm 12.6.0, pinned in `.tool-versions` and `package.json`.
Run `pnpm install --frozen-lockfile`, then `pnpm exec wrangler deploy --dry-run`
for a local packaging check. Production deployment is a manual GitHub workflow
on `main`; push and pull request checks do not deploy.
