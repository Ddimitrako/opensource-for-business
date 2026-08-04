# OpenSource for Business

A static-first, sales-oriented catalog of 63 recognizable open-source products across eight enterprise buying departments. Profiles make business fit, deployment paths, language coverage, edition boundaries, license duties, and sellable services easy to scan.

## Run locally

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:3000`. The production build is exported to `out/` with `npm run build` and needs no runtime database, account, or secret.

## Quality checks

```bash
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run test:e2e
pnpm run build
```

## Catalog data

- `src/data/projects.json` contains curated editorial profiles.
- `src/data/departments.json` contains the buyer taxonomy.
- `src/data/licenses.json` contains OSI-approved license profiles and evidence.
- `src/data/repo-snapshots.json` is generated separately from editorial data.

To refresh repository metrics, optionally set `GITHUB_TOKEN` for higher API limits and release lookup, then run:

```bash
pnpm run catalog:refresh
```

The refresh script flags observed license drift for manual review. It never changes a project’s selected editorial license automatically. License summaries are operational guidance, not legal advice.
