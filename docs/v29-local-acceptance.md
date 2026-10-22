# V2.9 combined local acceptance and fictional-demo safeguards

This checklist is intended for the V2.9 **temporary combined branch**, not a production release test or verified road safety study. No automatic change to a report, incident, photograph, `RoadSegment.currentStatus`, road access, closures, or routes is acceptable.

## Before checking out the testing branch (Windows / PowerShell)

1. Stop `npm run dev` and other SQLite writers. Use a terminal **at the repository root** with `package.json` and `.git`.
2. Back up the user's existing locally modified `public/data/bbr-roads.geojson`, `prisma/dev.db` and any `dev.db-wal`, `dev.db-shm`, `dev.db-journal` (if present), plus private `.env`/`.env.local`. Keep backups **outside** the repository.
3. Inspect `git status`, preserve all tracked/untracked work in a uniquely labelled stash if a branch change is necessary, and verify clean status before switching. Do not `stash pop` onto a different branch.
4. Fetch and switch to `integration/pr56-57-local-test-20261022` when this testing branch is actually published, then restore the original local GeoJSON **only** from the backup. This restores the user's imported local reference data, not a verified map dataset.
5. Run `npm install`, `npm run db:generate`, `npm test`, `npm run typecheck`, `npm run build`, `npm run dev`. No schema changes are included.

**Forbidden on existing user data:** database seeding/reset, destructive `db:push`/migration, geo imports, force-checkout, `git reset --hard` or `git clean -fd`.

## One-session acceptance matrix

| Origin | Check | Expected |
| --- | --- | --- |
| #56 | Management login → **Inspect review ages** | Aggregate counts of fictional unverified reports and under-review groups plus oldest-first metadata rows; no report narrative, coordinates or evidence. |
| #56 | Re-run the queue with unchanged DB | Stable ordering except normal age increases; no auto-links, review-status writes or road impacts. |
| #56 | Test HTTP API without operator header | `GET /api/v2/review-age-queue` responds 403 in development. |
| #57 | Management → **Inspect local source** | SHA-256, byte size, imported line and source-tag coverage appear. |
| #57 | Repeat without editing the GeoJSON file | Same exact SHA-256. Other laptops/copies can legitimately differ. |
| #57 | Test HTTP API without operator header | `GET /api/v2/geo-source-manifest` responds 403 in development. |
| Regression | Incident lifecycle and explicit human link/unlink | Must keep reason/audit safeguards; no AI auto-updates. |
| Regression | Private photo inspection, explicit public-demo approval, inventory | Confidential photo contents stay private unless separately approved. |
| Regression | Road candidate geometry, provenance, topology and access diagnostics | Remain read-only and labelled `osm_unverified`, not verified access/routing. |
| Regression | Oversight, data-quality diagnostics, research export | Existing panels work; CSV must not expose report descriptions, precise coordinates, review notes, photo bytes or keys. |
| Regression | No SQLite or GeoJSON reset/reimport | Existing fictional reports, groups, evidence and imported local roads persist. |

## Release gate

A GitHub CI success alone is insufficient. User explicitly reports pass/fail for each feature/regression check. Any material integration fix receives a new tested commit and CI, and focused retesting when warranted. After user approval: merge original feature PRs individually, preserve all dashboard components during conflicts, then compare the *complete* final `main` Git tree to the tested branch and verify post-merge CI. Close the temporary combined PR without merging it.

Safety summary: fictional synthetic data, unverified OSM geography, advisory local AI, privacy-preserving evidence review and local-only operator key are all **demonstration constraints**, not evidence of operational security, accuracy or production readiness.
