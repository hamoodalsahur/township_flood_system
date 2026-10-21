# Importing BBR-area road geometry

We use OpenStreetMap road **geometry for visual research only**. The current flood simulation and graph connectivity still use the fictional schematic network.

## How to import

On the `feature/bbr-road-import` branch, run:

```powershell
npm install
npm run geo:import
npm test
npm run typecheck
npm run dev
```

The script sends a one-time Overpass request for a **small research rectangle** (south 3.075, west 101.42, north 3.095, east 101.45). This rectangle is **not** the township boundary and does not cover all BBR development areas. A stable internet connection and a responsive Overpass service are needed. Avoid repeated rapid requests; the public service can be busy.

If successful, it writes `public/data/bbr-roads.geojson`. The two portals' geographic reference maps then display OSM road polylines with an unverified label. The initial committed file is deliberately empty, so the app still works before import. If the remote service fails, the importer leaves the file unchanged.

## Important limitations

- Imported features are OSM lines, *not* verified road topology or road status.
- The import can include adjacent streets and incomplete segments. Geometry from a bounding box can extend outside it.
- Do not use it as an evacuation route, real-time flood map, source of safe road recommendations, or true township-wide road network.
- Do not combine these OSM features with our fictional road-status simulation.
- Inspect individual OSM way links and assess data quality before declaring a mapped road verified.
- OpenStreetMap contributors: © OSM, Open Database License (ODbL). Attribution must remain visible. [Copyright and licence](https://www.openstreetmap.org/copyright). Background tiles have a separate [tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

## Next milestone

Review the imported dataset, filter relevant road types, audit junction connectivity and provenance, then develop a *separate* real-geography graph for hypothetical analysis. Do not overwrite existing scenario data.
