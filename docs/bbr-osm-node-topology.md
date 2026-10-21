# Node-ID topology review — research milestone

Our study-area importer retains ordered `osmNodeIds` from Overpass ways alongside each coordinate and selected OSM tags. The importer rejects malformed or misaligned arrays rather than silently constructing false node connections. Old GeoJSON is still readable for the reference map.

## How to test and use

1. Back up `public/data/bbr-roads.geojson` to a location outside the repository, and keep a copy of any local reports.
2. Check out the feature branch, restore your existing imported data, run `npm install`, `npm test`, `npm run typecheck`, and `npm run build`.
3. Run `npm run geo:node-topology` **before** re-import. It should warn that your old file lacks source node IDs.
4. When ready, run `npm run geo:import` **once** to refresh the bounded study-area OSM extract. This overwrites the local GeoJSON; the external backup protects your original 1,269-way snapshot. Avoid repeated rapid Overpass requests.
5. Run `npm run geo:node-topology` again. It writes `reports/bbr-osm-topology.json`, covering node references, segment counts, shared-node candidates, groups, coordinate collisions, and review flags.
6. Run `npm run dev`. In the geographic reference map on both resident and management pages, inspect the source-node summary and a few flagged nodes. Refresh only when needed; mapped data and street access remain unverified.

## What to interpret carefully

An OSM node ID links *source map primitives*. Compared with rounding coordinates to six decimals, this avoids treating two independent OSM nodes at the same rounded location as the same node. A shared node ID still **does not** prove traffic can turn at that location; road restrictions, barriers, lane direction, bridges and legal access require further validation. A mismatched `layer` is a research flag, not proof of a disconnected street.

The report counts connectivity groups only among ways with node references. Missing references, partial geographic coverage, and bounding-window clipping can make groups incomplete. The analysis is not flood prediction, evacuation advice, public road-closure information or safe routing.

Reports save locally; this feature never alters the database or the existing fictional simulation network.
