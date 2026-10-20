# Development progress log

## Milestone 0 — Foundation (20 October 2026)

- Owner verified `npm install`, `npm run typecheck`, `npm run build`, and `npm run dev`.
- Owner confirmed all three pages `/`, `/resident`, `/management` render correctly.
- PR #1 merged into `main`; issue #2 closed.

## Phase 1A — Data foundation

- Added schema, deterministic schematic dataset, APIs and graph-invariant tests on branch `feature/phase1a-data-foundation`.
- Owner reported VS Code tests ran successfully and localhost APIs opened.
- Pull request #4 awaits formal review/merge.

## Phase 1B — Interactive schematic map

- Added Leaflet `CRS.Simple` network explorer driven by existing `/api/zones` and `/api/roads` endpoints.
- Added road/zone detail panel, selected styling, explicit provenance labels and keyboard selection lists.
- Resident and management views share the same component but do not imply live conditions.
- **Pending:** owner runs `npm install`, `npm test`, `npm run typecheck`, `npm run build` and browser verification. No local build was executed by the connected GitHub editing interface.

## Phase 2 — Rules-based synthetic 4R scenario (implementation branch)

- Added five deterministic stages with synthetic rainfall, retention and tide values.
- Added explainable categoric risk evaluator, shared scenario APIs, and an explicit demo reset.
- Added scripted operator closure events with **SIMULATED_DEMO_OPERATOR** as the recorded actor; stage 5 keeps confirmed demo closures closed.
- Added a controller to resident and management views and road status colouring sourced from SQLite APIs.
- **Pending:** local `npm test`, `npm run typecheck`, `npm run build`, interactive browser scenario run and review. Not field validated.
