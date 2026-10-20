# Our development log

This is a quick record of what we've built and what we've actually checked on the project owner's computer.

## Project setup — 20 October 2026

We set up Next.js, TypeScript, Tailwind and the two starting pages. The project owner confirmed that dependency installation, type checking and the production build worked, and that the homepage, resident page and management page opened locally. PR #1 was merged and Issue #2 was closed.

## Phase 1A — Database

Added SQLite and Prisma, plus four fictional zones, eight graph nodes, ten network links and our first read-only APIs. The project owner reported that the local setup and URLs worked. The test geography is not actual BBR mapping.

## Phase 1B — Interactive map

Added the Leaflet map to both pages. Clicking roads and zones brings up their stored details. The project owner confirmed that the map and information panel worked in the browser.

## Phase 2 — Flood simulation

Added five scripted stages with invented rainfall, wetland storage, tide and road status changes. A simulated closure stays closed when the scenario reaches its recovery stage. We still need a separately recorded, complete test checklist for this phase.

## Phase 3 — Road connections

Added a checker for theoretical connections between fictional junctions. It excludes closures, unverified flooding reports and walking trails. The project owner confirmed the update worked locally. These results are not travel advice.

## Phase 4 — Report submissions

Added a form for fictional resident reports and a management queue to corroborate or reject them. Reports don't close roads automatically. The project owner confirmed the screens worked as far as checked; full automated test results haven't been separately provided.

## Before we deploy

Finish the remaining test checklists, add authenticated operator access, review our data sources and make sure the demo-only APIs aren't public. The feature pull requests are still awaiting integration into `main`.

## Phase 5 — Local review protection and history

Added a private local demo key check to the report review API. Every completed review is stored with a matching audit entry in one transaction, and management can read the recent review history. These controls are **development-only**, not production authentication. Local tests are pending.
