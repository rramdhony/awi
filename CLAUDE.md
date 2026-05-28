# AWI Partners

Single-page site for awipartners.africa.
AWI Partners helps companies expand into Africa with market entry, workforce
strategy, compliance planning and AI-enabled delivery.

## Deployment

- **Type:** Cloudflare Worker (name: `awi-partners`)
- **Live URL:** https://awipartners.africa
- **Pipeline:** push to `main` → GitHub Actions → `wrangler deploy` → live in ~60s
- **Config:** `wrangler.toml` at repo root with `[assets] directory = "."`

## Architecture

Single `index.html` with relative-path assets (logos, photos) bundled and
served by the Worker via the `[assets]` directive in `wrangler.toml`.

### Assets in this repo (served by Worker)

- `logo.png` — main AWI logo
- `ruben.jpeg` — team photo
- `aegis-logo.png` — partner logo
- `LIG-logo.png` — partner logo
- `evologics-logo.png` — partner logo

All asset references in `index.html` are relative paths (e.g. `logo.png`).
Do not change them to absolute URLs unless also moving files to R2.

### Fonts

Cormorant Garamond + DM Sans — loaded from Google Fonts.

## What to avoid

- Do not add a `public/` subfolder — assets must stay at root level to match
  the relative URLs in `index.html`
- This is a Worker, not Cloudflare Pages — do not use `wrangler pages deploy`
