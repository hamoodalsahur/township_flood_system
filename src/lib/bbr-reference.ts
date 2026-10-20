/** Source-linked geographic reference points. Not a road network or flood dataset. */
export type GeographicPoint = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: { id: string; name: string; sourceUrl: string; sourceLabel: string; evidence: string; verification: "source_mapped"; };
};
export type GeographicPointCollection = { type: "FeatureCollection"; features: GeographicPoint[] };

/**
 * Explicit WGS84 GeoJSON: [longitude, latitude].
 * Source locations are rounded reference points, NOT surveyed township boundaries.
 */
export const bbrReferencePoints: GeographicPointCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [101.4377, 3.0852] },
      properties: {
        id: "osm-bukit-raja-locality",
        name: "Bukit Raja (mapped locality)",
        sourceUrl: "https://www.openstreetmap.org/node/6920264020",
        sourceLabel: "OpenStreetMap node 6920264020 (via Mapcarta)",
        evidence: "Approximate OSM locality point; not a mapped township boundary.",
        verification: "source_mapped",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [101.39804, 3.13035] },
      properties: {
        id: "osm-bbr-utara-toll",
        name: "Bandar Bukit Raja Utara (toll point)",
        sourceUrl: "https://www.openstreetmap.org/node/7770488481",
        sourceLabel: "OpenStreetMap node 7770488481 (via Mapcarta)",
        evidence: "Mapped tollbooth point north-west of central Bukit Raja; not a confirmed township entrance.",
        verification: "source_mapped",
      },
    },
  ],
};

export function isValidLonLat(coordinates: number[]): boolean {
  return coordinates.length === 2 && coordinates.every(Number.isFinite) &&
    coordinates[0] >= -180 && coordinates[0] <= 180 &&
    coordinates[1] >= -90 && coordinates[1] <= 90;
}
