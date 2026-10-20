# Development progress log

## Milestone 0 — Foundation (20 October 2026)

- Owner verified `npm install`, `npm run typecheck`, `npm run build`, and `npm run dev`.
- Owner confirmed all three pages `/`, `/resident`, `/management` render correctly.
- PR #1 merged into `main`; tracked issue #2 closed.

## Phase 1A — Data foundation (implementation branch)

- Added SQLite/Prisma models for provenance, schematic zones, graph nodes, road edges, status-event history and scenario runs.
- Added deterministic, idempotent demonstration seed with 4 zones, 8 nodes, 10 edges and 3 gateways.
- Added read-only `GET /api/zones` and `GET /api/roads`.
- Added graph-invariant tests and a strict source register.
- **Not yet locally verified:** dependency installation, Prisma generation/database sync, tests, typecheck, build and API response inspection. Owner should perform the commands in `docs/phase1a-setup.md`.

**Next:** Build and test a map/schematic UI from validated geometry, then plan the acquisition of sourced BBR road geometry.
