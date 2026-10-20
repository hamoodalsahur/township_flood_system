"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, Polyline } from "react-leaflet";
import { bbrReferencePoints, isValidLonLat } from "@/lib/bbr-reference";
import type { RoadFeature } from "@/lib/bbr-roads";

const features = bbrReferencePoints.features.filter(feature => isValidLonLat(feature.geometry.coordinates));
export default function GeographicReferenceMap({ roads = [] }: { roads?: RoadFeature[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={[3.1075, 101.418]} zoom={11} minZoom={9} maxZoom={18}
        scrollWheelZoom={false} zoomControl={false}
        className="h-[340px] w-full bg-slate-100 sm:h-[420px]"
        aria-label="Geographic context near Bandar Bukit Raja; not a flood or road safety map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <ZoomControl position="topright" />
        {roads.map(road => (
          <Polyline key={road.properties.id}
            positions={road.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number])}
            pathOptions={{ color: "#0f766e", weight: 4, opacity: 0.75 }}>
            <Tooltip sticky>{road.properties.name} · OSM mapped, not locally verified</Tooltip>
          </Polyline>
        ))}
        {features.map(feature => {
          const [longitude, latitude] = feature.geometry.coordinates;
          return (
            <CircleMarker key={feature.properties.id} center={[latitude, longitude]} radius={8}
              pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#0f766e", fillOpacity: 1 }}>
              <Tooltip>{feature.properties.name} · source-linked reference only</Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
