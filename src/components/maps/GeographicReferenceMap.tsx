"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import { bbrReferencePoints, isValidLonLat } from "@/lib/bbr-reference";
import { roadStyle } from "@/lib/bbr-road-display";
import type { RoadFeature } from "@/lib/bbr-roads";

function FocusSelectedGroup({ roads, focusGroup }: { roads: RoadFeature[]; focusGroup: number }) {
  const map = useMap();
  useEffect(() => {
    if (focusGroup === 0 || roads.length === 0) return;
    const points = roads.flatMap(road => road.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]));
    if (points.length > 0) map.fitBounds(points, { padding: [24, 24], maxZoom: 16 });
  }, [map, roads, focusGroup]);
  return null;
}

const features = bbrReferencePoints.features.filter(feature => isValidLonLat(feature.geometry.coordinates));

export default function GeographicReferenceMap({
  roads = [],
  selectedRoadId,
  onSelectRoad,
  focusGroup = 0,
}: {
  roads?: RoadFeature[];
  selectedRoadId: string | null;
  onSelectRoad: (id: string) => void;
  focusGroup?: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={[3.087, 101.435]} zoom={14} minZoom={9} maxZoom={18}
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
        <FocusSelectedGroup roads={roads} focusGroup={focusGroup} />
        {roads.map(road => {
          const selected = selectedRoadId === road.properties.id;
          return (
            <Polyline key={road.properties.id}
              positions={road.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number])}
              pathOptions={selected ? { color: "#2563eb", weight: 7, opacity: 1 } : roadStyle(road.properties.highway)}
              eventHandlers={{ click: () => onSelectRoad(road.properties.id) }}>
              <Tooltip sticky>{road.properties.name} · click for source details</Tooltip>
            </Polyline>
          );
        })}
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
