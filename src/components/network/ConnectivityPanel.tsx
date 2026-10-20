"use client";

import { useCallback, useEffect, useState } from "react";
import { GitBranch, RefreshCcw } from "lucide-react";
import type { MapNode, RoadsResponse } from "@/lib/map-types";

type Result = {
  connected: boolean; nodeIds: string[]; edgeIds: string[]; uncertainRoadIds: string[];
  excludedRoadIds: string[]; explanation: string; disclaimer: string;
};

export default function ConnectivityPanel() {
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadNodes = useCallback(async () => {
    try {
      const response = await fetch("/api/roads", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not retrieve road network");
      const data: RoadsResponse = await response.json();
      if (data.dataMode !== "simulation" || data.coordinateSystem !== "schematic_xy") throw new Error("Unsupported network mode");
      setNodes(data.nodes);
      setOrigin(current => current || data.nodes[0]?.id || "");
      setDestination(current => current || data.nodes[data.nodes.length - 1]?.id || "");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load junctions");
    }
  }, []);
  useEffect(() => { void loadNodes(); }, [loadNodes]);
  useEffect(() => {
    const listener = () => { setResult(null); void loadNodes(); };
    window.addEventListener("township-demo-updated", listener);
    return () => window.removeEventListener("township-demo-updated", listener);
  }, [loadNodes]);

  async function assess() {
    setBusy(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/network/assess", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
      });
      const data: Result & { error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Network assessment failed");
      setResult(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Network assessment failed");
    } finally { setBusy(false); }
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="Schematic connectivity analysis">
      <div className="flex items-center gap-2">
        <GitBranch size={20} className="text-ocean" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Network connectivity experiment</h2>
      </div>
      <p className="mt-2 text-sm text-slate-600">Compare two fictional junctions after excluding roads marked closed or reported flooded. This tests connectivity only, not vehicle access or travel safety.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">Start junction
          <select value={origin} onChange={event => { setOrigin(event.target.value);setResult(null); }} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-3 font-normal">
            {nodes.map(node => <option key={node.id} value={node.id}>{node.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">End junction
          <select value={destination} onChange={event => { setDestination(event.target.value);setResult(null); }} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-3 font-normal">
            {nodes.map(node => <option key={node.id} value={node.id}>{node.label}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={busy || !origin || !destination || origin===destination} onClick={() => void assess()} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300">Check theoretical connection</button>
        <button type="button" onClick={() => {setResult(null);void loadNodes();}} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"><RefreshCcw size={14}/> Refresh</button>
      </div>
      {error ? <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {result ? <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4" role="status">
        <p className="font-semibold">{result.connected ? "A theoretical connection exists" : "No connection in this graph under current restrictions"}</p>
        <p className="mt-2 text-sm">{result.explanation}</p>
        {result.connected ? <p className="mt-2 text-xs">Graph nodes: {result.nodeIds.join(" → ")}</p> : null}
        <p className="mt-2 text-xs">Restricted or trail links excluded: {result.excludedRoadIds.length}. Links with unknown/at-risk status in graph path: {result.uncertainRoadIds.length}.</p>
        <p className="mt-3 text-sm font-semibold text-amber-900">{result.disclaimer}</p>
      </div> : null}
    </section>
  );
}
