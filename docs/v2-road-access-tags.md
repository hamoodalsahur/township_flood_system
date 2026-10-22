# OSM access-tag caveats — unverified geographic research

This operator-only panel provides **read-only counts** from the local `public/data/bbr-roads.geojson` file. It complements the shared-node topology checks; it is **not** a routing engine, verified access inventory, road-impact assessment, or current hazard source.

## What the diagnostic counts

- OSM one-way tags (including `-1`), unexpected one-way tag values.
- Access and motor-vehicle tags whose values differ from affirmative `yes`/`true`/`1`. These are *review flags*, not confirmed restrictions.
- Road lines with no access or motor-vehicle tag; missing means **unknown**, not open.
- Bridge/tunnel tags, non-zero numeric layers, and unparseable layer values.

A line can contribute to multiple counters; do not add them up to estimate how many roads are unsafe or restricted. All local OSM tags can be incomplete, stale or fictional-demo context only. Even correct OSM ways/nodes do not establish legal turns, crossings, navigability or safe routes.

## Validation

No Prisma migration, seeding, OSM importer run or file mutation. On a development machine with the original local GeoJSON, start the app, sign in to `/management`, and select **Inspect OSM tags**. Check counters, the warning and existing topology/incident review panels. Unauthorized API request to `/api/v2/road-access-tags` should fail closed (403). Unit tests use entirely synthetic OSM tags.

Do not merge before local operator testing. This is not production data or emergency-road advice.
