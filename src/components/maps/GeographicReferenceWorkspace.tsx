"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { validRoadCollection, type RoadFeature } from "@/lib/bbr-roads";
import { filterRoads, roadCategory, type RoadFilter } from "@/lib/bbr-road-display";
import { MapPinned, ExternalLink } from "lucide-react";
import { bbrReferencePoints } from "@/lib/bbr-reference";

const GeographicReferenceMap = dynamic(() => import("./GeographicReferenceMap"), {
  ssr: false,
  loading: () => <div className="flex h-[340px] items-center justify-center rounded-xl bg-slate-100 text-slate-600">Loading geographic map…</div>,
});

const categories: { value: RoadFilter; label: string }[] = [
  { value: "all", label: "All roads" },
  { value: "major", label: "Major roads" },
  { value: "local", label: "Local streets" },
  { value: "service", label: "Service roads" },
  { value: "other", label: "Other" },
];

export default function GeographicReferenceWorkspace() {
  const [roads, setRoads] = useState<RoadFeature[]>([]);
  const [roadMessage, setRoadMessage] = useState("Checking for locally imported roads…");
  const [filter, setFilter] = useState<RoadFilter>("all");
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/data/bbr-roads.geojson", { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Road file unavailable");
        const data: unknown = await response.json();
        if (!validRoadCollection(data)) throw new Error("Road file failed validation");
        if (active) {
          setRoads(data.features);
          setRoadMessage(data.features.length
            ? `${data.features.length} OSM mapped road lines imported (unverified, not a connected graph).`
            : "No road lines imported yet. Run npm run geo:import locally.");
        }
      }).catch(() => { if (active) setRoadMessage("Road file missing or invalid; showing reference points only."); });
    return () => { active = false; };
  }, []);

  const visibleRoads = useMemo(() => filterRoads(roads, filter), [roads, filter]);
  const selectedRoad = roads.find(road => road.properties.id === selectedRoadId) ?? null;
  const counts = useMemo(() => ({
    major: filterRoads(roads, "major").length,
    local: filterRoads(roads, "local").length,
    service: filterRoads(roads, "service").length,
    other: filterRoads(roads, "other").length,
  }), [roads]);

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="BBR geographic reference map">
      <div className="flex items-center gap-2 text-teal-800"><MapPinned size={19} aria-hidden="true" /><p className="text-xs font-bold uppercase tracking-wide">Geographic reference · WGS84</p></div>
      <h2 className="mt-1 text-xl font-semibold">Bandar Bukit Raja area reference</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">OpenStreetMap road geometry is displayed for geographic context only. These lines are not a verified connected graph, township boundary, real flood warning or safe travel guidance. Our simulated scenario remains separate.</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <label className="block text-sm font-semibold">
          Show road category
          <select value={filter} onChange={event => { setFilter(event.target.value as RoadFilter); setSelectedRoadId(null); }} className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2">
            {categories.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
        </label>
        <p className="text-sm text-slate-600">{visibleRoads.length} lines displayed · {roads.length} imported</p>
      </div>
      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
        <GeographicReferenceMap roads={visibleRoads} selectedRoadId={selectedRoadId} onSelectRoad={setSelectedRoadId} />
        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm" aria-live="polite">
          <h3 className="font-semibold">Selected road</h3>
          {selectedRoad ? (
            <div className="mt-3 space-y-2">
              <p className="break-words font-semibold">{selectedRoad.properties.name}</p>
              <p>OSM type: <span className="font-medium">{selectedRoad.properties.highway.replaceAll("_", " ")}</span></p>
              <p>Category: {roadCategory(selectedRoad.properties.highway)}</p>
              <p className="text-slate-600">Verification: mapped by OSM contributors; not independently checked.</p>
              <a href={selectedRoad.properties.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all font-semibold text-teal-700 underline">Inspect OSM way <ExternalLink size={14}/></a>
              <button type="button" className="block rounded-lg border px-3 py-1 text-xs" onClick={() => setSelectedRoadId(null)}>Clear selection</button>
            </div>
          ) : <p className="mt-3 text-slate-600">Select a road line on the map for its name, type and source link.</p>}
          <hr className="my-4 border-slate-200"/>
          <h4 className="font-semibold">Imported road categories</h4>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>Major: {counts.major}</li>
            <li>Local: {counts.local}</li>
            <li>Service: {counts.service}</li>
            <li>Other: {counts.other}</li>
          </ul>
        </aside>
      </div>
      <p role="status" className="mt-2 text-sm text-slate-600">{roadMessage}</p>
      <p className="mt-3 text-xs text-slate-600">Map data © OpenStreetMap contributors. The background tiles require internet access; line data comes from your imported GeoJSON file.</p>
      <h3 className="mt-4 font-semibold">Reference points and sources</h3>
      <div className="mt-2 grid gap-3 md:grid-cols-2">
        {bbrReferencePoints.features.map(feature => (
          <article key={feature.properties.id} className="rounded-lg border border-slate-200 p-3 text-sm">
            <h4 className="font-semibold">{feature.properties.name}</h4>
            <p className="mt-1 text-slate-600">{feature.properties.evidence}</p>
            <p className="mt-1 text-xs text-slate-500">WGS84: {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}</p>
            <a className="mt-2 inline-flex items-center gap-1 font-semibold text-teal-700 underline"
              href={feature.properties.sourceUrl} target="_blank" rel="noopener noreferrer">View mapped source <ExternalLink size={13}/></a>
          </article>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-900">REFERENCE ONLY — NOT LIVE FLOOD INTELLIGENCE. Lines and points do not establish road access, flood safety or directions.</p>
    </section>
  );
}
