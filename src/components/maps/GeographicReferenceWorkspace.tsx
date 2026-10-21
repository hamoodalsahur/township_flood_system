"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { validRoadCollection, type RoadFeature } from "@/lib/bbr-roads";
import { filterRoads, roadCategory, type RoadFilter } from "@/lib/bbr-road-display";
import { MapPinned, ExternalLink } from "lucide-react";
import { bbrReferencePoints } from "@/lib/bbr-reference";
import { reviewSmallGroups } from "@/lib/bbr-small-groups";
import { roadReviewFlags } from "@/lib/bbr-road-review-flags";
import { inspectOsmNodeTopology } from "@/lib/bbr-osm-topology";

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
  const [groupNumber, setGroupNumber] = useState(0);
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

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

  const smallGroups = useMemo(() => reviewSmallGroups({ type: "FeatureCollection", features: roads }).smallerGroups, [roads]);
  const topology = useMemo(() => inspectOsmNodeTopology({ type: "FeatureCollection", features: roads }), [roads]);
  const selectedNode = topology.reviewExamples.find(item => item.nodeId === selectedNodeId) ?? null;
  const selectedNodePosition = selectedNode ? selectedNode.coordinate.split(",").map(Number) as [number, number] : null;
  const activeGroup = smallGroups.find(group => group.groupNumber === groupNumber);
  const visibleRoads = useMemo(() => {
    const byCategory = filterRoads(roads, filter);
    if (!activeGroup) return byCategory;
    const ids = new Set(activeGroup.ways.map(road => road.id));
    return byCategory.filter(road => ids.has(road.properties.id));
  }, [roads, filter, activeGroup]);
  const selectedRoad = roads.find(road => road.properties.id === selectedRoadId) ?? null;
  const reviewFlags = selectedRoad ? roadReviewFlags(selectedRoad) : [];
  const counts = useMemo(() => ({
    major: filterRoads(roads, "major").length,
    local: filterRoads(roads, "local").length,
    service: filterRoads(roads, "service").length,
    other: filterRoads(roads, "other").length,
  }), [roads]);

  return (
    <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_55px_-45px_rgba(15,41,55,.45)] sm:p-6" aria-label="BBR geographic reference map">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-teal-800"><MapPinned size={18} aria-hidden="true" /><p className="text-xs font-bold uppercase tracking-[.14em]">Interactive area map</p></div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Bandar Bukit Raja · Road explorer</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Browse mapped roads, filter by type and select a line to inspect its OpenStreetMap source.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900"><span className="h-2 w-2 rounded-full bg-amber-500"/> Unverified map data</span>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4">
        <label className="block text-sm font-semibold">
          Show road category
          <select value={filter} onChange={event => { setFilter(event.target.value as RoadFilter); setSelectedRoadId(null); setSelectedNodeId(null); }} className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500">
            {categories.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Inspect candidate group
          <select value={groupNumber} onChange={event => { setGroupNumber(Number(event.target.value)); setFilter("all"); setSelectedRoadId(null); setSelectedNodeId(null); }} className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2">
            <option value={0}>All imported roads</option>
            {smallGroups.map(group => <option key={group.groupNumber} value={group.groupNumber}>Group {group.groupNumber} ({group.roadLineCount} lines)</option>)}
          </select>
        </label>
        <p className="text-sm text-slate-600">{visibleRoads.length} lines displayed · {roads.length} imported</p>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <GeographicReferenceMap roads={visibleRoads} selectedRoadId={selectedRoadId} onSelectRoad={setSelectedRoadId} focusGroup={groupNumber} selectedNodePosition={selectedNodePosition} />
        <aside className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm" aria-live="polite">
          {activeGroup ? <p className="mb-3 rounded-lg bg-amber-50 p-2 text-xs font-medium text-amber-900">Group {activeGroup.groupNumber}: {activeGroup.roadLineCount} mapped lines. Grouping is geometric only, not proof of disconnected roads.</p> : null}
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Road details</h3>
          {selectedRoad ? (
            <div className="mt-3 space-y-2">
              <p className="break-words font-semibold">{selectedRoad.properties.name}</p>
              <p>OSM type: <span className="font-medium">{selectedRoad.properties.highway.replaceAll("_", " ")}</span></p>
              <p>Category: {roadCategory(selectedRoad.properties.highway)}</p>
              {reviewFlags.length > 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <h4 className="font-semibold text-amber-950">Mapped tags to review</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-amber-950">
                    {reviewFlags.map(flag => <li key={flag.code}>{flag.label}</li>)}
                  </ul>
                  <p className="mt-2 text-xs text-amber-900">Review flags are based on unverified OSM tags, not actual road availability or flood safety.</p>
                </div>
              ) : <p className="text-xs text-slate-600">No review flags from the selected tags. Other restrictions may still exist.</p>}
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <h4 className="font-semibold">Mapped road attributes</h4>
                <dl className="mt-2 space-y-1 text-xs">
                  {(["oneway", "access", "bridge", "tunnel", "layer", "motor_vehicle", "junction"] as const).map(tag => (
                    <div key={tag} className="flex justify-between gap-3">
                      <dt className="text-slate-600">{tag.replaceAll("_", " ")}</dt>
                      <dd className="break-words text-right font-medium">{selectedRoad.properties[tag] ?? "Not recorded"}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-amber-900">OSM values are unverified. Missing tags do not mean unrestricted access or safe conditions.</p>
              </div>
              <p className="text-slate-600">Verification: mapped by OSM contributors; not independently checked.</p>
              <a href={selectedRoad.properties.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all font-semibold text-teal-700 underline">Inspect OSM way <ExternalLink size={14}/></a>
              <button type="button" className="block rounded-lg border px-3 py-1 text-xs" onClick={() => setSelectedRoadId(null)}>Clear selection</button>
            </div>
          ) : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-4"><MapPinned size={21} className="text-teal-700" aria-hidden="true" /><p className="mt-3 font-semibold text-slate-800">Select a road to explore</p><p className="mt-1 text-sm leading-6 text-slate-600">Click any road line on the map to see its name, mapped attributes and original source.</p></div>}
          <hr className="my-4 border-slate-200"/>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Mapped categories</h4>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>Major: {counts.major}</li>
            <li>Local: {counts.local}</li>
            <li>Service: {counts.service}</li>
            <li>Other: {counts.other}</li>
          </ul>
        </aside>
      </div>
      <details className="group mt-4 rounded-xl border border-slate-200 bg-slate-50/80">
        <summary className="cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-teal-600">Advanced research · Node topology and source inspection <span className="ml-1 text-xs font-normal text-slate-500">(expand)</span></summary>
        <div className="border-t border-slate-200 p-4" aria-label="OSM source node inspection">
        <h3 className="font-semibold">Source-node topology inspection</h3>
        {topology.status === "missing_node_ids" ? (
          <p className="mt-2 text-sm text-slate-600">This imported file does not include original OSM node IDs. Back up the GeoJSON and refresh it using the upgraded importer to enable node-based inspection. Coordinate grouping alone is not proof of road access.</p>
        ) : (
          <>
            <p className="mt-2 text-xs text-slate-600">Research only · source node references on {topology.waysWithNodeIds} of {topology.roadLines} road lines. {topology.waysWithoutNodeIds > 0 ? "Partial source coverage: unmatched ways are not assessed." : "All imported ways have source node IDs."}</p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <div><dt className="text-slate-500">Shared OSM nodes</dt><dd className="text-lg font-semibold">{topology.sharedOsmNodes}</dd></div>
              <div><dt className="text-slate-500">Candidate groups</dt><dd className="text-lg font-semibold">{topology.candidateWayGroups}</dd></div>
              <div><dt className="text-slate-500">Coordinate collisions</dt><dd className="text-lg font-semibold">{topology.coordinateCollisionLocations}</dd></div>
              <div><dt className="text-slate-500">Review flags</dt><dd className="text-lg font-semibold">{topology.flaggedSharedNodes}</dd></div>
            </dl>
            {topology.reviewExamples.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <label className="text-sm font-semibold">
                  Inspect flagged OSM node
                  <select value={selectedNodeId ?? ""} onChange={event => {
                    const id = Number(event.target.value);
                    setSelectedNodeId(event.target.value ? id : null);
                    setGroupNumber(0); setFilter("all"); setSelectedRoadId(null);
                  }} className="mt-1 block max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
                    <option value="">Choose source node</option>
                    {topology.reviewExamples.slice(0, 30).map(item =>
                      <option key={item.nodeId} value={item.nodeId}>Node {item.nodeId} · {item.reasons[0]}</option>
                    )}
                  </select>
                </label>
                {selectedNode ? (
                  <div className="text-xs text-slate-700">
                    <p>Mapped ways: {selectedNode.wayIds.join(", ")}</p>
                    <p>Review: {selectedNode.reasons.join("; ")}</p>
                    <a href={selectedNode.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline">View OSM node source</a>
                  </div>
                ) : null}
              </div>
            ) : null}
            <p className="mt-3 text-xs text-amber-900">Shared source node IDs indicate OSM data relationships only. They do not verify turns, accessibility, road safety or live flooding. The map remains separate from the demonstration scenario.</p>
          </>
        )}
      </div>
      </details>
      <p role="status" className="mt-3 text-xs text-slate-500">{roadMessage}</p>
      <p className="mt-3 text-xs text-slate-600">Map data © OpenStreetMap contributors. The background tiles require internet access; line data comes from your imported GeoJSON file.</p>
      <details className="mt-3 rounded-xl border border-slate-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Reference points, attribution and source links <span className="ml-1 text-xs font-normal text-slate-500">(expand)</span></summary>
        <div className="grid gap-3 border-t border-slate-200 p-4 md:grid-cols-2">
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
      </details>
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs leading-5 text-amber-950"><strong>Geographic reference only.</strong> This OSM layer is not an official township boundary or verified connected network, and cannot establish actual flood conditions, road access or safe directions. The simulation below uses separate fictional data.</p>
    </section>
  );
}
