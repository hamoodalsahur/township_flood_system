# V2.9 local geographic source fingerprint (operator-only)

This is a **read-only reproducibility aid** for the specific local `public/data/bbr-roads.geojson` file. The existing user-modified imported BBR file must never be replaced, reseeded or rewritten for this feature.

`GET /api/v2/geo-source-manifest` requires the existing local-development demo operator key. It reads the file's bytes, validates the supported GeoJSON shape, calculates an SHA-256 digest of **exact bytes**, and returns summary counts for road lines, unique and duplicate OSM way IDs, vertex count, optional original node IDs and selected recorded OSM tags. The endpoint does not return road coordinates or raw source contents; it does not load any report locations. API responses use `Cache-Control: private, no-store`.

An exact hash match indicates exact file-byte equality. An unmatched hash can be caused by whitespace, ordering or other differences; neither situation proves the file is authoritative, current, licensed for a particular use, navigable, legally accessible or safe. All map geometry remains `osm_unverified`. This is not incident-to-road mapping.

## Local acceptance

No Prisma schema, migrations, database writes, geo imports, AI calls or dependency additions. On a combined QA branch, keep and back up your local SQLite, GeoJSON and `.env`, then open `/management` and select **Inspect local source**. Confirm the fingerprint/coverage metrics appear. Repeating without changing the file should yield exactly the same digest. Different copies on groupmates' PCs may yield different digests. Verify existing read-only OSM tag/topology panels still work and unauthorized calls return 403.

This feature is intended for controlled academic demos, not verified road or emergency information.
