"use client";

import { useMapEvents, MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import { bbrReferencePoints, isValidLonLat } from "@/lib/bbr-reference";
import { roadStyle } from "@/lib/bbr-road-display";
import type { RoadFeature } from "@/lib/bbr-roads";
import type { DemoHazard } from "@/lib/demo-hazards";

function FocusSelectedNode({ selectedNodePosition }: { selectedNodePosition: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedNodePosition) return;
    const [longitude, latitude] = selectedNodePosition;
    map.setView([latitude, longitude], 16, { animate: false });
  }, [map, selectedNodePosition?.[0], selectedNodePosition?.[1]]);
  return null;
}

function FocusSelectedGroup({ roads, focusGroup }: { roads: RoadFeature[]; focusGroup: number }) {
  const map = useMap();
  useEffect(() => {
    if (focusGroup === 0 || roads.length === 0) return;
    const points = roads.flatMap(road => road.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]));
    if (points.length > 0) map.fitBounds(points, { padding: [24, 24], maxZoom: 16 });
  }, [map, roads, focusGroup]);
  return null;
}

function LocationPicker({ onChooseLocation }: {onChooseLocation?: (coordinates:[number,number])=>void}) {
  useMapEvents({ click(event) { onChooseLocation?.([event.latlng.lng,event.latlng.lat]); } });
  return null;
}
const features = bbrReferencePoints.features.filter(feature => isValidLonLat(feature.geometry.coordinates));

export default function GeographicReferenceMap({
  roads = [],
  selectedRoadId,
  onSelectRoad,
  focusGroup = 0,
  selectedNodePosition = null,
  hazards = [],
  onSelectHazard = () => {},
  selectedHazardId = null,
  onChooseLocation,
  selectedLocation = null,
}: {
  roads?: RoadFeature[];
  selectedRoadId: string | null;
  onSelectRoad: (id: string) => void;
  focusGroup?: number;
  selectedNodePosition?: [number, number] | null;
  hazards?: DemoHazard[];
  onSelectHazard?: (id: string) => void;
  selectedHazardId?: string | null;
  onChooseLocation?: (coordinates:[number,number])=>void;
  selectedLocation?: [number,number] | null;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
      <MapContainer
        center={[3.087, 101.435]} zoom={14} minZoom={9} maxZoom={18}
        scrollWheelZoom={false} zoomControl={false}
        className="h-[390px] w-full bg-slate-100 sm:h-[520px] lg:h-[570px]"
        aria-label="Geographic context near Bandar Bukit Raja; not a flood or road safety map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <ZoomControl position="topright" />
        <LocationPicker onChooseLocation={onChooseLocation} />
        {selectedLocation ? <CircleMarker center={[selectedLocation[1],selectedLocation[0]]} radius={10} pathOptions={{color:"#0f766e",fillColor:"#5eead4",fillOpacity:1,weight:3}}><Tooltip permanent>Draft demo report location</Tooltip></CircleMarker>:null}
        <FocusSelectedGroup roads={roads} focusGroup={focusGroup} />
        <FocusSelectedNode selectedNodePosition={selectedNodePosition} />
        {selectedNodePosition ? <CircleMarker
          center={[selectedNodePosition[1], selectedNodePosition[0]]} radius={10}
          pathOptions={{ color: "#b45309", fillColor: "#fbbf24", fillOpacity: 0.9, weight: 3 }}>
          <Tooltip permanent>Mapped OSM node — review only</Tooltip>
        </CircleMarker> : null}
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
        {hazards.map(hazard => (
          <CircleMarker key={hazard.id} center={[hazard.coordinates[1], hazard.coordinates[0]]}
            radius={selectedHazardId === hazard.id ? 12 : 9}
            eventHandlers={{ click: () => onSelectHazard(hazard.id) }}
            pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#dc6c19", fillOpacity: 0.95 }}>
            <Tooltip sticky>DEMO hazard · {hazard.title} · click for details</Tooltip>
          </CircleMarker>
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
