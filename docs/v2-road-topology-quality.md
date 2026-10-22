# Read-only OSM topology quality overview

This feature reports **source geometry consistency** on the existing locally imported `public/data/bbr-roads.geojson`; it does not create routable junctions or make travel-safety claims.

The local-development operator can click **Inspect road geometry** to see totals for way lines, missing original OSM node IDs, shared-node connected component candidates, isolated ways, repeated adjacent OSM nodes, zero-length geometry segments, duplicate imported way IDs and node-coordinate inconsistencies.

Connected component sizes mean only that ways share original OSM node IDs. They **do not** prove accessible junctions, legal turns, passable roads, safe travel or actual hazard impact. Bridge/layer/access restrictions require independent review. If the imported file has no preserved OSM node IDs, the dashboard explicitly reports no node topology conclusion.

## Local test
Protect any local edits to `public/data/bbr-roads.geojson` and back up `prisma/dev.db`. Switch to the PR branch, run `npm install` and `npm run dev`, and open `/management` > **OSM topology consistency**. The inspection reads the local file; **do not run geo:import or db:seed**. Compare zero-length and missing-node counts with existing geographic audit views, and check incident grouping, AI and photos still function. No Prisma migration required.

This is demonstration-only source QA, not official mapping validation.
