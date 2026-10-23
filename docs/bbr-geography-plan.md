# Bandar Bukit Raja geography: evidence and next steps

This document prepares the transition from the **fictional schematic network** to a geographically grounded demonstration. It is a source register and work plan, **not** a verified road graph, navigation map or flood-risk assessment.

## Current project data

Our current Prisma seed uses `schematic_xy` coordinates. Its four zones, nodes and road links are fictional test records. The current Leaflet map uses `CRS.Simple` for that schematic network; neither locations nor edge lengths should be interpreted as latitude/longitude, real roads, metres, driving times or road accessibility.

Do not replace schematic records with real-world labels alone. Geometry, topology and data provenance must be checked before claiming that a segment represents a real road.

## Primary references to verify map context

| Reference | What it supports | What it does **not** establish |
| --- | --- | --- |
| [Sime Darby Property — Bandar Bukit Raja](https://simedarbyproperty.com/bandar-bukit-raja/index.html) | Official township context; references Wetland Townpark and neighbourhood amenities. | Machine-readable road geometry, a complete drainage network, live flood conditions. |
| [Sime Darby Property — Jalan Meru flyover (12 August 2022)](https://www.simedarbyproperty.com/press-releases/sime-darby-propertys-officially-opened-flyover-jalan-meru-adds-convenience-road) | Identifies Jalan Meru and connections involving Persiaran Sungai Keramat, Persiaran Astana and Bandar Setia Alam; the release describes a 420 m flyover. | Current road closures, exact junction coordinates or passability during flooding. |
| [Sime Darby Property — The Straits brochure](https://simedarbyproperty.com/bandar-bukit-raja/the-straits/ebrochure.pdf) | Location/masterplan context for BBR 1, BBR 2 and BBR 3, and surrounding road labels such as Jalan Meru and Jalan Kapar. | Survey-grade coordinates, a reusable GIS dataset or definitive township boundaries. |
| [OpenStreetMap copyright and data licence](https://www.openstreetmap.org/copyright) | Potential source of reusable mapped roads with attribution and ODbL obligations. | Proof that every mapped feature is up-to-date or suitable for routing and flood safety. |

The first three sources are developer/context material, not a ready-to-import set of GIS features. Cross-check road names and positions using an appropriate licensed digital geographic dataset and inspect gaps manually. Verify any planned or under-construction roads against current sources before including them as existing.

## Proposed data import workflow

1. **Scope:** define the demo area and a small number of meaningful road junctions; document whether a line represents BBR 1, 2, 3, an adjacent access route, or a proposed link.
2. **Acquire:** use a properly licensed GIS dataset such as relevant OpenStreetMap road geometries; retain origin, access date, licence and source URL for imported records.
3. **Validate:** check GeoJSON geometry, WGS84 longitude/latitude order, duplicated nodes, crossings, dangling segments, one-way flags and whether pedestrian paths are excluded from road connectivity.
4. **Review:** compare named corridors and major junctions against current official maps or other reliable references. Keep unresolved features labelled **unverified**.
5. **Integrate separately:** introduce a new geographically grounded dataset and map mode; do not overwrite the existing demonstration scenario, reports or road IDs. Preserve schematic mode for predictable hackathon tests.
6. **Explain:** distinguish *mapped road geometry* from *simulated network disruption*. The graph may only report hypothetical connectivity under stated assumptions—not passability or evacuation recommendations.
7. **Test:** review both modes, source attribution, map controls, map rendering on small screens, and examples of incorrect or missing coordinates.

## Technical implications

- Existing `GraphNode.x/y`, `TownshipZone.boundaryJson`, and `RoadSegment.lengthUnits` are schematic constructs. Real geographic features should use explicit lon/lat or GeoJSON fields and a declared CRS, rather than silently reinterpreting those existing fields.
- A future WGS84 map requires a compatible Leaflet CRS/basemap and source attribution. `CRS.Simple` remains appropriate for the current schematic demonstration.
- Keep source and verification data with features, including retrieval date and uncertainty. The source's existence alone does not validate every road segment.
- Avoid asserting live flood conditions, emergency directions, travel safety or measured hydrological performance; none are supported by the existing data.

## Next implementation task

Prepare a **small, reviewed BBR road network sample** with explicit GeoJSON coordinates and a per-feature source register. Only then build an optional geographic map view. The schematic network should remain intact until the new dataset has passed review.
