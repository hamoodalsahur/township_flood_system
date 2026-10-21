# Road review indicators

When selecting a geographic reference road, the panel now highlights OSM tags worth checking: `access=private/no`, `oneway=yes/-1`, and `bridge=yes`, `tunnel=yes` or nonzero `layer`. All values remain available in the raw tag list.

A review indicator **does not mean a road is unsafe, closed or inaccessible**; it means the imported metadata calls for human review before attempting topology interpretation. No indicator does not mean unrestricted road access. The map and simulated flood network remain separate.

Test the resident and management maps against your existing backed-up imported GeoJSON, and run `npm test`, `npm run typecheck` and `npm run build`.
