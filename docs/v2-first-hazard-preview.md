# V2.1 first vertical slice — multi-hazard preview

This PR deliberately makes a small, **tested and non-destructive** first step:
1. Introduces a typed hazard taxonomy and four fictional reports at illustrative WGS84 coordinates within the geographic reference map.
2. Adds visible DEMO hazard markers, a category filter, optional show/hide toggle and clickable marker information alongside existing source-linked OSM road lines.
3. Expands the existing **simulation-only** report category dropdown and API validation to include roadworks, fallen trees, potholes, storm damage and other hazards.
4. Keeps the existing `FloodReport` table, demo graph, management review and road scenario controls untouched. Existing reports still reference fictional `RD-DEMO-` road IDs and **do not create geographic pins**.

## Important limitations
- All geographic markers are **fixed fictional fixtures**, not live reports, sensor results, AI predictions, verified road closures or truthful statements about those real-world coordinates.
- Marker coordinates are illustrative points, NOT confirmed matches to OSM road features. No routing or closure is inferred from a pin.
- No image uploads, new persistence tables, report clustering, alternative routing or real model AI have been implemented.
- User photos and shared map pin creation will require the additive incident/evidence schema, moderation, storage safeguards and operator review flow outlined in PR #30.

## Test
Run `npm test`, `npm run typecheck` and `npm run build`, then browse `/resident` and unlocked `/management`. Turn example pins off/on, filter Fallen tree vs Flooding, click the orange marker and inspect the category/impact disclaimer. Submit a fictional fallen-tree report in the legacy demo form and confirm management can review it. This still does not create a geographic marker.

Preserve your local `public/data/bbr-roads.geojson` before changing branches; imported OSM geometry is not checked in.
