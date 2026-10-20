# Setting up the database

Before starting, stop the Next.js development server using Ctrl+C.

## Run it in VS Code (PowerShell)

```powershell
git fetch origin
git switch feature/phase1a-data-foundation
git pull origin feature/phase1a-data-foundation
Copy-Item .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm test
npm run typecheck
npm run build
npm run dev
```

If `.env` already exists, do not overwrite it; check that `DATABASE_URL="file:./dev.db"` is present for local development.

The following addresses should return JSON:
- http://localhost:3000/api/zones — 4 schematic zones, unknown risk
- http://localhost:3000/api/roads — 8 schematic nodes and 10 road segments, unknown statuses

**The geometry is deliberately not drawn on a real BBR map yet.** It uses local schematic X/Y coordinates rather than actual latitude/longitude. A source-verified map is a separate milestone.

### Idempotent seed

Running `npm run db:seed` repeatedly creates no duplicates and **does not overwrite existing road status fields**. The seed is a first-time sample dataset and must not be used to reset real records.

### Common problems

- `Can't reach database` or `table does not exist`: run `npm run db:push`, then `npm run db:seed`.
- `@prisma/client did not initialize`: run `npm run db:generate`.
- `DATABASE_URL missing`: copy `.env.example` to `.env`.
- `EPERM` on Windows during Prisma generation: close the Next.js server, then rerun generate.
- Next.js page requests can work even if the database hasn't been initialised; check the two APIs separately.

## Git collaboration

Local `npm install` normally generates a `package-lock.json` for reproducibility. That lockfile isn't generated in this repository branch yet; after local verification, commit it to the feature branch using a focused commit and open/review the Phase 1A pull request.
