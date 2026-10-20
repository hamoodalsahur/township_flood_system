"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Database, MapPinned, RefreshCw } from "lucide-react";
import type { MapRoad, MapZone, RoadsResponse, ZonesResponse } from "@/lib/map-types";
import { isSchematicMapData, statusLabel } from "@/lib/map-types";

const NetworkMap = dynamic(() => import("./NetworkMap"), {
  ssr: false,
  loading: () => <div className="flex h-[370px] items-center justify-center bg-slate-100 sm:h-[450px]">Preparing schematic network…</div>,
});

type Selection = { kind: "road"; record: MapRoad } | { kind: "zone"; record: MapZone };
type WorkspaceData = { zones: ZonesResponse; roads: RoadsResponse };

export default function MapWorkspace({ variant }: { variant: "resident" | "management" }) {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [zoneResponse, roadResponse] = await Promise.all([
        fetch("/api/zones", { signal, cache: "no-store" }),
        fetch("/api/roads", { signal, cache: "no-store" }),
      ]);
      if (!zoneResponse.ok || !roadResponse.ok) throw new Error("Database API unavailable");
      const [zones, roads] = (await Promise.all([zoneResponse.json(), roadResponse.json()])) as [ZonesResponse, RoadsResponse];
      if (
        !isSchematicMapData(zones, roads) ||
        !Array.isArray(zones.zones) ||
        !Array.isArray(roads.nodes) ||
        !Array.isArray(roads.roads)
      ) throw new Error("Unexpected source mode or incompatible map data");
      setData({ zones, roads });
    } catch (cause) {
      if (signal?.aborted) return;
      setData(null);
      setError(cause instanceof Error ? cause.message : "Could not load map data");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void reload(controller.signal);
    return () => controller.abort();
  }, [reload]);

  const selection: Selection | null = useMemo(() => {
    if (!data || !selectedId) return null;
    const road = data.roads.roads.find(record => record.id === selectedId);
    if (road) return { kind: "road", record: road };
    const zone = data.zones.zones.find(record => record.id === selectedId);
    return zone ? { kind: "zone", record: zone } : null;
  }, [data, selectedId]);

  const gatewayCount = data?.roads.roads.filter(road => road.corridorType === "ingress_egress_gateway").length ?? 0;

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="Interactive schematic road network">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Simulation · schematic XY · not GPS</p>
          <h2 className="mt-1 text-xl font-semibold text-navy">{variant === "resident" ? "Township network explorer" : "Network operations overview"}</h2>
        </div>
        <button type="button" onClick={() => void reload()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">
          <RefreshCw size={15} aria-hidden="true" /> Refresh data
        </button>
      </div>
      <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-950" role="note">
        <AlertTriangle size={16} className="mr-2 inline-block" aria-hidden="true" />
        SCHEMATIC DEMONSTRATION — NOT LIVE CONDITIONS. No real BBR road coordinates, closures, warnings or navigation instructions.
      </p>
      {loading && !data ? <div className="flex h-64 items-center justify-center text-slate-600" role="status">Loading network from database…</div> : null}
      {error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
          <strong>Map data unavailable.</strong> {error}. Run the database setup, then click Refresh data.
        </div>
      ) : null}
      {data && !error ? (
        <>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <NetworkMap zones={data.zones.zones} nodes={data.roads.nodes} roads={data.roads.roads} selectedId={selectedId} onSelect={setSelectedId} />
              <div className="flex flex-wrap gap-x-4 gap-y-2 border-t bg-white px-3 py-3 text-xs text-slate-600">
                <span>● Gateway node</span>
                <span className="text-slate-600">━ Road link</span>
                <span className="text-violet-700">┄ Trail (not drivable)</span>
                <span>All conditions: Unknown</span>
              </div>
            </div>
            <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4" aria-live="polite">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected feature</p>
              {selection ? (
                <div className="mt-3 space-y-3 text-sm">
                  <h3 className="text-lg font-semibold leading-snug">{selection.record.name ?? (selection.kind === "road" ? selection.record.label : "")}</h3>
                  <dl className="space-y-2">
                    <div><dt className="font-medium text-slate-500">Type</dt><dd>{selection.kind === "road" ? selection.record.corridorType.replaceAll("_", " ") : "Illustrative zone"}</dd></div>
                    <div><dt className="font-medium text-slate-500">{selection.kind === "road" ? "Road status" : "Flood risk"}</dt><dd>{selection.kind === "road" ? statusLabel(selection.record.status) : "Unknown — no sensor observations"}</dd></div>
                    <div><dt className="font-medium text-slate-500">Verification</dt><dd>{selection.record.provenance.verificationStatus}</dd></div>
                    <div><dt className="font-medium text-slate-500">Source</dt><dd>{selection.record.provenance.sourceName}</dd></div>
                    {selection.kind === "road" ? <div><dt className="font-medium text-slate-500">Last verified</dt><dd>{selection.record.lastVerifiedAt ?? "Never"}</dd></div> : null}
                  </dl>
                </div>
              ) : (
                <div className="mt-3 text-sm leading-6 text-slate-600">
                  <MapPinned className="mb-3 text-ocean" size={24} aria-hidden="true" />
                  Click a zone or road on the map to inspect its status and provenance.
                </div>
              )}
              <hr className="my-4 border-slate-200" />
              <div className="flex items-center gap-2 text-xs text-slate-600"><Database size={15} /> Records read from local SQLite APIs</div>
              <p className="mt-2 text-xs text-slate-600">{data.zones.zones.length} schematic zones · {data.roads.roads.length} links · {gatewayCount} gateways</p>
            </aside>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <strong>Accessibility:</strong> Select a feature on the map, or use the keyboard-accessible lists below. No routes or safe travel recommendations are provided.
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Zones</h3>
              <div className="max-h-52 space-y-1 overflow-y-auto">
                {data.zones.zones.map(zone => (
                  <button key={zone.id} type="button" onClick={() => setSelectedId(zone.id)} aria-pressed={selectedId === zone.id} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-blue-50 ${selectedId === zone.id ? "border-blue-600 bg-blue-50" : "border-slate-200"}`}>{zone.name}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Roads and trail</h3>
              <div className="max-h-52 space-y-1 overflow-y-auto">
                {data.roads.roads.map(road => (
                  <button key={road.id} type="button" onClick={() => setSelectedId(road.id)} aria-pressed={selectedId === road.id} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-blue-50 ${selectedId === road.id ? "border-blue-600 bg-blue-50" : "border-slate-200"}`}>{road.label}</button>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
