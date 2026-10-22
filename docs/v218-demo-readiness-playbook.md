# V2.18 — Fictional end-to-end demonstration readiness

**Scope:** University prototype, offline/local-first walkthrough only. No live hazard validation, road closure verification, route recommendations or real emergency use. The BBR geographic layer is imported from OSM, unverified, and can differ between individual computers.

## Before the demonstration (preserve existing owner data)

1. Stop the Next.js server and other applications accessing the local SQLite file. Back up the existing `prisma/dev.db`, if present its `-wal`/`-shm`/`-journal` sidecars, `public/data/bbr-roads.geojson`, and private `.env` files to a folder **outside** the repository. Never commit/print the operator key or photos.
2. Check `git status` and preserve any uncommitted work; do not run `git reset --hard` or `git clean`. Fetch and switch only to the **approved tested** branch/main.
3. With Node.js/npm installed: `npm install`, `npm run db:generate`, `npm test`, `npm run typecheck`, `npm run build`, and `npm run dev`. No `db:push`, `db:seed`, `geo:import` or schema operations on the owner's existing data.
4. Open `/resident` and `/management` at localhost. The development-only `DEMO_OPERATOR_KEY` stays private. If maps need external tiles, internet access may be required; the imported road GeoJSON remains local and **unverified**.

## Demonstration storyboard (entirely made-up reports, sample images only)

| Step | Audience action | Expected, observable result | Safety boundary |
| --- | --- | --- | --- |
| 1. Resident context | Open `/resident`, explore imported geographic roads, view blue road categories and marker legend | Map responds to road/marker selection; source details visible | OSM source not validated, no live route/access safety |
| 2. Fictional submission | Choose a point in demo area, select a category and suspected impact, enter an invented description, optionally attach a **non-identifying sample image** | Existing simulation report stored locally; optional image uploads privately | User impact is unverified suspicion, no automatic road changes |
| 3. Intake | Sign in locally to management, open Incidents and select the submitted geographic report | Compact list, status, description and existing human review controls | Never share demo key or private images publicly |
| 4. Private evidence | If a sample image was attached, deliberately open the private preview; record required operator rationale; explicitly opt into public-demo image approval only with suitable non-identifying sample | Unapproved image remains private; approved sample appears inline in operator review and map popup after corroboration | Report corroboration and image publication are **separate decisions** |
| 5. Incident grouping | Create a fictional group from eligible report, optionally compare AI candidate text, supply operator justification and explicitly link | Audit-backed grouping; no automatic AI action | Text similarity is not verification/probability; one report belongs to at most one group |
| 6. Map demonstration | Refresh resident geographic map and select fictional marker; toggle short, dashed human-reviewed vicinity colors if present | Approved fictional image and/or conservative colored demo vicinity display as applicable | Marker location and colored section are **not** verified obstruction or closure |
| 7. Simulation | Walk through five-stage schematic flood scenario and network connectivity | Observable fictional stage transitions in the separate simulation | Schematic graph is not road navigation |
| 8. Evidence and research | Show operator Evidence, Research and System/Audit pages | Metadata-only inventory, advisory evaluation and human action history | No real accuracy/fairness/safety guarantee; no real location verification |

## Recovery and failure drill (no DB reset)

- **Offline/failed requests:** Use browser DevTools network offline mode, click refresh in the incident/report review section, verify a loading failure is visible (V2.17 after approved merge). Restore online and use Retry loading. This should not mutate records.
- **AI provider offline:** Show that optional local Ollama analysis can be unavailable without preventing manual decisions. Do not claim AI runs remotely or automatically.
- **No sample photo:** Report should show concise no-photo status; do not try to retrieve protected photo URLs by guessing IDs.
- **Approved photo absent:** Verify the independent public-demo approval status and corroborated state through normal operator UI; do not weaken private-image permissions.
- **No colored vicinity:** A fictional report can be corroborated while geometry matching remains too distant/ambiguous. An absent dashed stroke is expected and not evidence that a road is clear.
- **Maps unavailable:** Explain that OSM tile loading depends on connectivity. The local GeoJSON source may still be read without proving real-world access.

## Sign-off checklist

- [ ] Unit tests, typecheck, Next.js build pass on exact final commit
- [ ] Fictional resident submission stored without changing road status
- [ ] Local management key works; no production-auth claims
- [ ] Private and approved public-demo photo experiences differ correctly
- [ ] AI/manual group decisions require reasons and explicit human actions
- [ ] Blue road hierarchy, opacity, unverified provenance and colored vicinity disclaimers verified
- [ ] Failure/retry and offline AI situations shown without data loss
- [ ] Metadata-only evidence/audit views contain no photo contents or secrets
- [ ] Six-page management navigation and resident simulation function
- [ ] Teammates can run their **own fresh disposable** database, without sharing the owner's SQLite/key
- [ ] Final GitHub main tree and CI agree with locally approved integration branch

## Outstanding risks (not addressed by presentation polish)

The local development operator key is **not** production authentication. There is no verified live monitoring, authoritative hazard classification, independently validated road topology, emergency dispatch, privacy/legal clearance for actual media, or public-safety deployment approval. Do not publish this demo as a real road-condition service.
