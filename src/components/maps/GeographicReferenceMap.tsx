"use client";

import { useMapEvents, MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, Polyline, useMap, Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import { HAZARD_SYMBOLS } from "@/lib/hazard-symbols";
import { useEffect } from "react";
import { bbrReferencePoints, isValidLonLat } from "@/lib/bbr-reference";
import { roadStyle } from "@/lib/bbr-road-display";
import {candidateVicinityColor,type CandidateVicinityStroke} from "@/lib/v215-road-vicinity";
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
function markerIcon(category: keyof typeof HAZARD_SYMBOLS, selected: boolean) {
  const info = HAZARD_SYMBOLS[category];
  // Only fixed, trusted symbols and colors are interpolated; no report text or user HTML.
  return divIcon({
    className: "hazard-map-marker",
    html: `<span class="hazard-map-marker__symbol${selected ? " hazard-map-marker__symbol--selected" : ""}" style="--hazard-color:${info.color}" aria-hidden="true">${info.symbol}</span>`,
    iconSize: [42, 46],
    iconAnchor: [21, 43],
    popupAnchor: [0, -40],
  });
}
const features = bbrReferencePoints.features.filter(feature => isValidLonLat(feature.geometry.coordinates));

export default function GeographicReferenceMap({
  roads = [],
  vicinityStrokes = [],
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
  vicinityStrokes?: readonly CandidateVicinityStroke[];
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
        {vicinityStrokes.map(stroke=>(
          <Polyline key={stroke.reportId+"-"+stroke.wayId}
            positions={stroke.points.map(([lon,lat])=>[lat,lon] as [number,number])}
            pathOptions={{color:candidateVicinityColor(stroke.impact),weight:8,opacity:0.92,dashArray:"10 6"}}
            eventHandlers={{click:()=>onSelectRoad(stroke.wayId)}}>
            <Tooltip sticky>
              Fictional human-corroborated report vicinity · {stroke.impact.replaceAll("_"," ")} · about {stroke.approximateMetres} m from unverified OSM line.
              NOT a verified road obstruction, closure or navigable road status.
            </Tooltip>
          </Polyline>
        ))}
        {hazards.map(hazard => (
          <Marker key={hazard.id} position={[hazard.coordinates[1], hazard.coordinates[0]]}
            icon={markerIcon(hazard.category, selectedHazardId === hazard.id)}
            eventHandlers={{ click: () => onSelectHazard(hazard.id) }}
            keyboard
            title={`Fictional ${HAZARD_SYMBOLS[hazard.category].label} report. Click for details.`}>
            <Tooltip direction="top" offset={[0, -32]}>DEMO · {HAZARD_SYMBOLS[hazard.category].label} · {hazard.title}</Tooltip>
          </Marker>
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
