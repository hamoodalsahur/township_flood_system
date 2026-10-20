# Initial architecture and scope

## User journeys

**Resident:** open the portal → choose neighbourhood → read status *and evidence freshness* → inspect reported/verified road incidents → optionally submit report.

**Operator:** open the dashboard → review alerts/reports → verify evidence → record a road incident or closure with a reason → audit status and later reopening.

**Hackathon presenter:** activate *SIMULATION* mode → step through a controlled flood timeline → show the resident and operator views changing together. Simulator actions must remain separate from the real-data pathway.

## Proposed implementation

- Frontend: Next.js App Router + React + TypeScript + Tailwind CSS
- Mapping later: Leaflet, sourced geographic data with provenance and attribution
- MVP storage later: Prisma + SQLite
- Shared backend: Next.js server routes
- Flood logic: explainable rules first, external public-data integration only when verified
- Road logic: graph connectivity, closures and uncertainty; never suggest driving through floodwater
- Testing later: unit tests for statuses, graph connectivity and simulation invariants; browser flows

## Initial repository scope

This foundation commit delivers a runnable app shell and navigable resident/operator pages. It intentionally contains no pretend map data, flood statistics, routes or functioning backend.

## Handoff principles

- Keep source modes explicit: `simulation`, `historical_replay`, `live`.
- Keep distinct risk assessments, crowd reports and verified operational closures.
- Treat outdated data as unknown.
- Verify real BBR road/staging location names before depicting them as suitable destinations.
- Prefer modular features and incremental, reviewable commits.
