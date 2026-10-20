"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw, ChevronRight, Droplets, CloudRain } from "lucide-react";

type Snapshot = {
  stage: number; title: string; rPhase: string; rainMmHr: number;
  wetlandFillPercent: number; tide: string; overallRisk: string;
  riskExplanation: string; narrative: string; dataMode: string;
};
const changeEvent = "township-demo-updated";

export default function DemoController({ operatorKey = "", readOnly = false }: { operatorKey?: string; readOnly?: boolean }) {
  const [scenario, setScenario] = useState<Snapshot | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/scenarios/current", { cache: "no-store" });
      if (!response.ok) throw new Error("Cannot read scenario API; check local database.");
      setScenario(await response.json() as Snapshot);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Scenario unavailable");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const handler = () => { void load(); };
    window.addEventListener(changeEvent, handler);
    return () => window.removeEventListener(changeEvent, handler);
  }, [load]);

  async function change(next: number | "reset") {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        next === "reset" ? "/api/scenarios/reset" : "/api/scenarios/activate",
        { method: "POST", headers: { "Content-Type": "application/json", "x-demo-operator-key": operatorKey }, body: next === "reset" ? "{}" : JSON.stringify({ stage: next }) }
      );
      const result = await response.json() as Snapshot & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Scenario update failed");
      setScenario(result);
      window.dispatchEvent(new Event(changeEvent));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Scenario update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-teal-200 bg-white p-4 shadow-sm sm:p-6" aria-label="Demo simulation controller">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-800">SIMULATION — NOT LIVE CONDITIONS</p>
          <h2 className="mt-1 text-xl font-semibold text-navy">Five-stage 4R scenario controller</h2>
          <p className="mt-2 text-sm text-slate-600">Scripted, fictional inputs; both interfaces read the same SQLite records.</p>
        </div>
        <button type="button" disabled={busy || !scenario || !operatorKey || readOnly} onClick={() => void change("reset")} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50"><RotateCcw size={15} /> Reset demo</button>
      </div>
      {readOnly ? <p className="mt-2 text-sm text-slate-600">Resident view is read-only. Scenario changes are controlled in the local management demo.</p> : null}
      {!readOnly && !operatorKey ? <p className="mt-2 text-sm text-amber-800">Enter your local operator key above to control the demo.</p> : null}
      {error ? <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-900" role="alert">{error}</p> : null}
      {scenario ? (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {Array.from({length:5},(_,i)=>i+1).map(n=>(
              <span key={n} className={`rounded-full px-3 py-1 text-xs font-bold ${n===scenario.stage?"bg-teal-700 text-white":n<scenario.stage?"bg-teal-100 text-teal-900":"bg-slate-100 text-slate-500"}`}>Stage {n}</span>
            ))}
          </div>
          <h3 className="mt-4 text-lg font-bold">{scenario.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{scenario.narrative}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500"><CloudRain size={14} className="inline"/> Rain (simulated)</p><p className="text-lg font-semibold">{scenario.rainMmHr} mm/h</p></div>
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500"><Droplets size={14} className="inline"/> Wetland fill (simulated)</p><p className="text-lg font-semibold">{scenario.wetlandFillPercent}%</p></div>
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Tide (simulated)</p><p className="text-lg font-semibold capitalize">{scenario.tide}</p></div>
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Zone risk (simulated)</p><p className="text-lg font-semibold capitalize">{scenario.overallRisk}</p></div>
          </div>
          <p className="mt-3 text-xs text-slate-600">Risk explanation: {scenario.riskExplanation}. No actual measurements or forecast accuracy claims.</p>
          <div className="mt-4 flex justify-end">
            <button type="button" disabled={busy || scenario.stage >= 5 || !operatorKey || readOnly} onClick={() => void change(scenario.stage + 1)} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white disabled:bg-slate-300">
              {busy ? "Updating…" : scenario.stage >= 5 ? "Scenario complete" : "Next stage"} <ChevronRight size={17}/>
            </button>
          </div>
        </>
      ) : !error ? <p className="mt-4 text-sm" role="status">Loading current demo scenario…</p> : null}
    </section>
  );
}
