"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from "react-leaflet";
import { bbrReferencePoints, isValidLonLat } from "@/lib/bbr-reference";

const features = bbrReferencePoints.features.filter(feature => isValidLonLat(feature.geometry.coordinates));

export default function GeographicReferenceMap() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={[3.1075, 101.418]} zoom={11} minZoom={9} maxZoom={18}
        scrollWheelZoom={false} zoomControl={false}
        className="h-[340px] w-full bg-slate-100 sm:h-[420px]"
        aria-label="Geographic reference locations near Bandar Bukit Raja; not a road status map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <ZoomControl position="topright" />
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
