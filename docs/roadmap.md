# Proposed roadmap v2 — Township Road & Hazard Intelligence System

> **Planning proposal, not implemented code.** Direction B expands the flood-awareness prototype into a multi-hazard township platform. The existing geographic OSM research map and the fictional simulation must stay distinctly labelled and separate until validated.

## Product focus

**Mission:** help residents report and understand local road disruptions, while township management gets a traceable way to assess evidence, publish updates and coordinate response.

**Hazard types:** flooding/standing water, road construction, fallen trees, potholes/road damage, debris/blocked roads, landslides/storm hazards and other issues. Flooding remains a prominent module, including the existing 4R synthetic scenario demonstration.

**Three separate concepts:** report (evidence) → incident (event being evaluated) → road impact (effect on a particular road). Multiple reports may relate to one incident. An AI recommendation is not an official verification.

## Where we are today

- **Working in the current repository:** Next.js resident and management pages, Leaflet geographic OSM reference map, import/topology research tools, SQLite/Prisma fictional network, five-stage synthetic flood scenario, theoretical graph connectivity, demo reporting/review and development-only operator key.
- **Known limitations:** geography is unverified for route access, community reports are currently linked to fictional road IDs, no public photo workflow, no AI inference service, no verified production roadway incident feed, no safe real-world directions, and no production authentication.
- PR #29 contains the one-click simulation showcase and is separately pending local acceptance/merge as of this planning proposal. Do not confuse proposed v2 capabilities with merged functionality.

## Sequenced milestones

| Phase | Deliverable | What counts as done |
| --- | --- | --- |
| **V2.0 — Architecture approval** | Confirm domain, status model, public/private evidence rules and demo scope | Team agrees on hazard taxonomy and how incidents differ from reports and road impacts |
| **V2.1 — Multi-hazard foundation** | Add canonical incident/report domain alongside old demo tables; predefined categories; incident statuses; coordinate/source modes | APIs and tests handle multi-hazard records without breaking scenario demos; simulation and operational data remain isolated |
| **V2.2 — Map-based reporting** | Resident category picker, optional photo proof, choose a map location, hazard marker pop-ups with evidence and time | A *demo* incident can be created, opened, filtered and reviewed; all photos checked for size/type, privacy and moderation before any public display |
| **V2.3 — Management triage & scheduled works** | Unified incident queue, evidence review, planned construction notices, linked road impacts, audit history | Only authorized operators can verify or change an authoritative road-impact state; residents see report vs verified labels and timestamps |
| **V2.4 — AI-assisted incident intelligence** | Text similarity/deduplication, category suggestions, prioritization, provenance and explainable recommendations; optionally image classification | A real model (not a rule labelled AI) is evaluated against a labelled test set; measurable quality, false positives and human override demonstrated |
| **V2.5 — Disruption and alternatives demo** | Detect fictional route overlap with a simulated road-impact record, compare two paths, notify about possible disruption | Demonstrates candidate alternatives only on the validated *synthetic* graph; does not recommend real-world travel |
| **V2.6 — Verified geographic integration** | Validate road-node topology, turn/direction/access rules, management/geographic incident-to-road matching, reliable update sources | No production route display without trustworthy routing coverage, legal-access handling, incident verification and independent field/source review |
| **V2.7 — Mobile/PWA and release safeguards** | Accessible responsive reporting, notifications, consent controls, production authentication, storage, moderation, retention, rate limits, operations | Security/privacy testing, abuse prevention, incident expiry, data backup, monitoring and rollback criteria met before public rollout |

## Suggested demo vertical slice (next 2–3 PRs)

1. Predefined hazard categories + a separate fictional incident store, never conflated with `FloodReport`.
2. Clickable example hazard pins on the *geographic reference* map, explicitly labelled **SIMULATED / DEMO** (not actual BBR incidents).
3. A fast resident reporting flow and a management review/publish decision, including photo placeholders initially; genuine uploads only with protected storage and moderation.
4. A basic AI-assisted duplicate/triage proof of concept on fabricated reports, with clearly shown confidence and operator decision.

## Technology approach

- **Keep now:** Next.js, React, TypeScript, Tailwind, Leaflet, Prisma/SQLite for local demo, existing scenario and graph code, automated tests.
- **Add gradually:** isolated `Incident` domain services/API; secure evidence storage adapter; model-based NLP/vision analysis behind a swappable interface; opt-in demo notifications.
- **Consider later:** PostgreSQL/PostGIS for spatial querying, background queues, identity provider, geocoding/routing engine, managed object storage, vetted external data feeds. These are proposed options, not existing dependencies.
- Prefer small vertical slices: schema + API + interface + tests + simulated seed records together, not unrelated database and UI changes.

## Non-negotiable product rules

- **Data mode:** `simulation`, `osm_research`, and a future `verified_operational` mode must never be silently combined.
- **Status vocabulary:** unverified report ≠ verified incident ≠ confirmed road closure.
- **AI:** may prioritise, cluster, classify and propose provisional notices, but cannot alone verify an incident or publish a confirmed road closure.
- **Routing:** no real-world safe route/evacuation advice from unverified OSM geometry, user reports or the fictional network.
- **Privacy:** location and evidence uploads need consent, access controls, metadata removal, content moderation, retention and deletion rules before public use.
- **Accessibility:** keyboard and mobile reporting plus clear labels and low-bandwidth fallback.

## Dependencies and scope decisions to approve

1. Keep flooding as the flagship hazard module while using an incident schema shared by all hazard categories.
2. Use a **separate v2 domain** with an additive database transition rather than immediately renaming/removing `FloodReport` or touching simulated status history.
3. Build public-looking demo markers from *clearly fictional seed data* until real reporting/privacy/verification workflows exist.
4. Make **AI incident grouping and triage** the first genuine AI deliverable; alternative-route recommendations begin as a clearly fictional network demonstration.
