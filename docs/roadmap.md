# Development roadmap — Township Road & Hazard Intelligence System

> **University fictional demonstration only (verified against code merged through 22 October 2026).** No operational road-safety, emergency dispatch, traffic routing, live hazard, validated geographic accessibility or confirmed closures. Local map geometry is OSM-derived and **unverified**; semantic AI is advisory and never changes incident/road status.

## Implemented and previously locally tested

| Milestone | Implemented capability | Verified scope and limits |
| --- | --- | --- |
| V1 setup / simulation | Next.js, Prisma SQLite, schematic graph, five-stage fictional flood simulation, connectivity demonstration and basic reports | Schematic coordinates/statuses represent **fictional examples**. Connectivity is not actual drivable routing. |
| V2 geographic reporting | Resident map/report submissions, locally imported BBR OSM reference lines, seven fictional hazard categories | User's tracked `public/data/bbr-roads.geojson` is locally modified and can differ from GitHub; never overwrite/import without permission. |
| V2 evidence/privacy | One sample photo per report, private operator inspection, explicit separate public-demo approval | Never use real identifying photos for tests. No production image scanning, secure storage or retention system. |
| V2 AI research | Optional local Ollama similarity triage, bilingual synthetic evaluation workbench, thresholds and CSV evaluation | AI suggestions are advisory; limited authored test cases do not establish real-world accuracy or fairness. |
| V2.5 incident management | Human-created `DemoIncident` groups, explicit link/unlink/status change with operator reason and audit | One linked group per report, rejected reports cannot remain grouped, no status change on `RoadSegment` from geographic/AI output. |
| V2.6 oversight / QA | Incident oversight, read-only fictional consistency checks, research metadata CSV export | Dashboard metrics are descriptive, not incident severity; report descriptions, photo contents, review notes and coordinates are excluded from CSV. Operator-authored incident titles may need review before sharing. |
| V2.6 geographic QA | Read-only nearby unverified OSM road candidates, source node topology audit | Proximity/shared node IDs do not prove road associations, legal junctions, accessibility, or safe routes. |
| V2.7 intake / tag diagnostics | Actual streamed JSON byte limits on demo intake; read-only OSM one-way/access/bridge/tunnel/layer summary | Local-development-only intake, not rate limiting, public authentication, or an authoritative OSM road model. |
| V2.8 provenance / privacy | Raw unverified candidate-tag caveats and metadata-only private evidence inventory with age indicators | Evidence inventory does not retrieve photos or perform deletion/publication. Age count is **not** a retention policy. |

The code through **V2.10** is merged into `main` following local combined testing and CI. The features listed above remain restricted to fictional demonstration and unverified OSM research.

## Additional completed milestones

| Milestone | Feature | State |
| --- | --- | --- |
| V2.9 | Operator-only review-age queue; local GeoJSON SHA-256 fingerprint and coverage manifest; test guidance | Merged, locally tested |
| V2.10 | Aggregate nearby fictional report-location observations for unverified OSM candidates; private evidence-publication consistency indicators; operator activity overview | Merged, locally tested, CI passed |

## Refinement-first roadmap (current priority)

Avoid creating more analytics panels simply to increase feature count. Prioritize reliability, usability, consistency, and end-to-end functionality of the existing resident and management experience.

1. **Next — Resident reporting and map UX refinement.** Make fictional report creation clearer, validate inputs inline, make upload outcomes and loading/error/empty states understandable, and improve small-screen and keyboard accessibility. Preserve limited local-demo write access, image safeguards and explicit disclaimers.
2. **Next — Operator incident-management workflow refinement.** Improve finding, filtering and understanding existing report/incident queues; make manual linking, review justifications, state transitions and audit consequences clear. AI suggestions must never trigger decisions automatically; no road status mutations.
3. **Next — Evidence/privacy experience refinement.** Make private-vs-public demo image state, human approval requirements and actionable metadata inconsistencies clear without exposing images or private descriptions through summary APIs. No automatic publication, revocation or deletion.
4. **Next — Dashboard consolidation and performance.** Organize existing oversight, research, map diagnostics and operator tools into clear sections or progressive disclosure instead of more standalone panels. Optimize repeated GeoJSON reads and expensive display work only where profiling demonstrates a need. Preserve existing checks and provenance caveats.
5. **Next — Regression, accessibility and reliability fixes.** Strengthen tests for complete fictional report → operator review → incident grouping → audit paths and protect original SQLite, local GeoJSON and private `.env`. Focus on actionable bugs and UI feedback rather than expanding academic benchmarking.

## Deferred, not active milestones

- **Human-reviewed road association persistence:** Consider only after the current workflows are refined and reviewed with the user. Any new tables or migrations require an explicit, backup-first separate approval. No automatic geographic road associations or closures.
- **Production authentication and deployment:** Future separate security/privacy review. Current local operator password does not provide production identity or role security. No public operational hazard system is approved.

**Removed from the planned version sequence:** the previously proposed V2.12 extended geographic source/topology work and V2.14 expanded academic evaluation work. Existing geographic safeguards and automated regression tests remain maintained; we are dropping those *expansion milestones*, not their protections.

**Release policy:** Feature work goes into isolated PRs and combined local test branches, with successful CI and explicit user acceptance before original PR merges. Avoid new database schemas, seeding/reset and external geographic imports without permission.

## Team workflow and local protection rules

1. Always start feature branches from the verified current `main`; use separate PRs and incremental commits.
2. Require CI (unit tests, TypeScript, build), then a dedicated integration branch for convenient combined local tests.
3. Before switching branches, stop the dev server and safely back up local `prisma/dev.db` (including WAL/SHM if present), `public/data/bbr-roads.geojson`, `.env` and local uncommitted work. Use stash carefully.
4. Never run `npm run db:seed`, `npm run geo:import`, `git reset --hard`, destructive schema pushes or force checkout on the user's working data.
5. New groupmate setups use their **own new SQLite DB** and independently configured `.env`, and may seed only disposable fresh DBs. Never share private operator keys, real identifying evidence or the user's DB.
6. Merge approved original PRs separately with conflict reconciliation. Validate final `main` tree against tested integration tree and await post-merge CI. Close temporary testing PRs without merging them.
