# Nonprofit sites monorepo

Two static-frontend + PHP-backend sites for affiliated nonprofits, sharing most logic.

- **CUF** (`sites/cuf/`) — Catholics United for the Faith. In production on InMotion.
- **SJF** (`sites/sjf/`) — The St. Joseph Foundation. Not yet scaffolded.
- **`core/`** — shared library (frontend components/scripts + PHP), populated incrementally.

Each site is self-contained today; shared code is extracted into `core/` module by module
so CUF never breaks. See `Issues.md` for the CUF code-review findings. The architecture and
migration plan live in the planning docs kept outside this repo.

## Build / run a site

Currently only CUF exists. From its directory:

```
cd sites/cuf
npm run build      # prod bundles -> docs/dist
npm run dev        # webpack dev server on :8080, proxies /server to PHP on :3000
```

Local dev also needs the PHP server (`php -S localhost:3000` in `sites/cuf/docs`) and the
gitignored `sites/cuf/config/` secrets. Deploy is `npm run build:deploy` (zips `docs/` for
upload to InMotion).
