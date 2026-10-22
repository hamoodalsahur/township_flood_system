# V2.11 — six-page management navigation (local fictional demonstration)

## Architecture

Instead of rendering all management tools in one long dashboard, V2.11 uses **six actual Next.js App Router pages** below a persistent `/management/layout.tsx`:

| Top navigation | URL | Retained components / workflow |
| --- | --- | --- |
| Overview | `/management` | `IncidentOversight`, `ReviewAgeQueue`, `OperatorAuditSummary` |
| Incidents | `/management/incidents` | `IncidentManager`, `V2HazardManager`, legacy `ReportWorkspace` in expandable section |
| Maps & Simulation | `/management/maps` | `GeographicReferenceWorkspace`, `DemoController`, `MapWorkspace`, `ConnectivityPanel` |
| Evidence | `/management/evidence` | `EvidenceInventory`, `EvidenceConsistency`; link to original report review for private-photo inspection and explicit public-demo photo approval |
| AI & Research | `/management/research` | `AiEvaluationWorkbench`, `ResearchExport`; inline AI report/incident suggestions remain on Incidents |
| System & Audit | `/management/system` | `DemoDataQuality`, `RoadTopologyQuality`, `GeoSourceManifest`, `RoadAccessTags`, `AuditPanel` (advanced sections expandable) |

All **19 existing management components** are retained. This count is of components, not independent public endpoints. The existing old single-screen `ManagementControls.tsx` becomes unused by the new management routes, but no business logic, incident workflow or API security rule is rewritten.

The navigation is horizontal, accessible by keyboard, and scrollable on smaller screens. It uses the project's existing light neutral/teal styling. No fake live weather, incident priorities, system health, geographic ratings or verified road statuses from the visual mockup are shown.

## Operator sign-in and page navigation

The existing **development-only** `DEMO_OPERATOR_KEY` is checked against the pre-existing `/api/audit` access control. The key is held in React memory by the persistent management layout only—never in URLs, browser storage, cookies or newly created server sessions. Navigation through **Next.js Links** between the six child pages retains the login during that tab session; a direct deep-link refresh requires a new login. Logout hides all management panels again. No production account features are introduced, and existing API-level operator checks remain in place.

A shared `PrototypeNotice` labels fictional hazards and unverified OpenStreetMap reference geometry. Resident pages remain on their existing separate route and existing site header.

## Safe combined local acceptance (Windows)

Stop the development server first and back up your original `prisma/dev.db` (including available WAL/SHM sidecars), locally changed `public/data/bbr-roads.geojson`, private `.env`/`.env.local` and Git uncommitted work **outside** the repository before branch switching. Do not run `db:seed`, `db:push`, geographic imports or destructive Git commands.

After switching to the V2.11 feature branch, restore your locally imported GeoJSON from the backup. Run `npm install`, `npm run db:generate`, `npm test`, `npm run typecheck`, `npm run build`, `npm run dev`.

Test:

1. Log in on `/management` using your existing local demo operator password; select all six top-menu pages and verify the active tab. The login should persist during normal in-app navigation, and logout or browser refresh should require sign-in.
2. Overview: verified **fictional** incident metrics, review-age queue and activity summary still load.
3. Incidents: report review, required human reasons, group creation/linking, optional local AI suggestions and private sample photo decisions still work. The legacy schematic report queue is reachable after expanding its section.
4. Maps: local edited OSM reference lines remain visible; separate schematic simulation and connectivity still work.
5. Evidence: inventory and metadata-only consistency cards load; click **Review a report's private photo** to navigate to Incidents without exposing image bytes on Evidence page.
6. AI & Research: existing workbench and minimized research CSV export remain functional.
7. System & Audit: data-quality panel loads; expand geographic diagnostics and history to inspect existing read-only source, access, topology and operator audit features.
8. On mobile/narrow width, top navigation scrolls horizontally and remains keyboard focusable. Look for UI overflow, duplicate components, errors and blank page transitions.
9. Run `npm test`, `npm run typecheck`, `npm run build` and verify the existing incident/photo review permissions, no automatic road status change, and no private photo publication without explicit operator approval.

**Privacy/geographic safety:** All reports and simulation states remain fictional. OSM lines are unverified and do not establish navigability or a safe route. AI is advisory only. No schema changes, seeding, data migration, geo import, status automation, or private source file writes are introduced.

## Merge gate

Only merge original V2.11 feature PRs after successful GitHub CI and explicit local user approval. Avoid merging the temporary integration test PR. Compare final merged Git tree with the tested head before marking complete.
