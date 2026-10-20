# Data integrity and safety requirements

This is a planning/hackathon system, **not a deployed flood warning or navigation service**.

## Required safeguards

- Show **SIMULATION — NOT LIVE CONDITIONS** on every future synthetic scenario view and API response.
- No invented real-time sensor values, predicted probabilities, real closures or verified staging hubs.
- Never label absent or stale information as passable or safe.
- A crowd report remains `unverified` until it is assessed by an authorised operator or trustworthy corroborating evidence; do not auto-convert it into a confirmed closure.
- A verified closure remains closed until separately approved for reopening.
- Keep a source name, source mode, observation time, ingestion time and freshness flag for readings.
- Protect precise home locations and personal report data.
- Distinguish simulator-supplied actions from real operator decisions in logs.
- Do not calculate sedan/4x4 'safe wading depth' recommendations or route users through reported flooding.
- Route outputs can show graph accessibility based on known restrictions, but cannot guarantee safety or replace official notices.

## Geographic verification needed

The v2.0 proposal names gateways, roads, JPS stations and proposed high-ground staging locations. Treat unverified names, coordinates, hydrological assumptions and station thresholds as **research leads**, not authoritative seed facts. Record supporting sources separately before integrating them into maps or active features.
