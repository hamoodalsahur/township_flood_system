# First geographic reference map

This milestone adds a **separate real-coordinate map** alongside the existing simulated schematic network. It deliberately does **not** claim that we have imported an accurate road graph.

## Points included

- Bukit Raja locality point: WGS84 latitude 3.0852, longitude 101.4377; [OSM node 6920264020](https://www.openstreetmap.org/node/6920264020); rounded location and feature identification checked against [Mapcarta's Bukit Raja entry](https://mapcarta.com/38581968).
- Bandar Bukit Raja Utara tollbooth: latitude 3.13035, longitude 101.39804; [OSM node 7770488481](https://www.openstreetmap.org/node/7770488481); checked against [Mapcarta's point entry](https://mapcarta.com/N7770488481).

The two point features are **geographic references**, not proposed navigation endpoints. The locality point does not define the BBR township boundary. The toll point should not be presented as a confirmed township gateway.

## Implementation

- `src/lib/bbr-reference.ts` stores a minimal GeoJSON FeatureCollection with coordinate metadata and source links. GeoJSON coordinates are `[longitude, latitude]`.
- `GeographicReferenceMap.tsx` uses Leaflet's standard geographic coordinate behaviour, adds OpenStreetMap background tiles and map attribution, and converts GeoJSON coordinates to Leaflet's `[latitude, longitude]`.
- `GeographicReferenceWorkspace.tsx` displays the source register alongside the reference map in both portals.
- `tests/bbr-reference.test.ts` checks coordinate ranges and metadata.

The OpenStreetMap tiles require an internet connection and are subject to OSM's tile usage policy. Respect attribution and consider a suitable tile provider for any public, high-traffic deployment.

## Still needed

A licensed downloadable road dataset, verified segment geometries, topology checks, road type and direction checks, per-segment provenance, and explicit separation between real map geometry and imaginary flood simulation. We should obtain those before switching the road-network and connectivity checker to real geography.

Do not infer road status, safety, passability, navigation or actual flood risk from these points.
