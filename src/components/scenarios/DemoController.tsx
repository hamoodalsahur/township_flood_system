"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw, ChevronRight, Droplets, CloudRain, CloudSun, Waves, ShieldAlert, ShieldCheck, ArrowDownRight } from "lucide-react";
import { DEMO_PRESETS } from "@/lib/demo-showcase";

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
  const [message, setMessage] = useState("");

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
    setMessage("");
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

  async function selectPreset(stage: 1 | 2 | 3 | 4 | 5) {
    if (!operatorKey || busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/scenarios/preset", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-demo-operator-key": operatorKey },
        body: JSON.stringify({ stage }),
      });
      const payload = await response.json() as Snapshot & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Preset could not be activated");
      setScenario(payload);
      const scene = DEMO_PRESETS.find(item => item.stage === stage);
      setMessage(scene ? scene.highlight + " All values are fictional." : "Demo scene changed.");
      window.dispatchEvent(new Event(changeEvent));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Demo scene update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="Demo simulation controller">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-800">SIMULATION — NOT LIVE CONDITIONS</p>
          <h2 className="mt-1 text-xl font-semibold text-navy">Five-stage 4R scenario controller</h2>
          <p className="mt-2 text-sm text-slate-600">Scripted, fictional inputs; both interfaces read the same SQLite records.</p>
        </div>
        {!readOnly ? <button type="button" disabled={busy || !scenario || !operatorKey} onClick={() => void change("reset")} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-50"><RotateCcw size={15} /> Reset demo</button> : null}
      </div>
      <div className="mt-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">{readOnly ? "Current demonstration scene" : "Choose a demo scene"}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600">{readOnly ? "This view reflects the operator-selected fictional scenario." : "Click any scene to switch the fictional network immediately. No real roads are affected."}</p>
          </div>
          {!readOnly ? <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">One-click presets</span> : null}
        </div>
        <div className={`mt-3 grid gap-2 ${readOnly ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-5"}`}>
          {DEMO_PRESETS.map(scene => {
            const selected = scenario?.stage === scene.stage;
            const icons = [CloudSun, CloudRain, Waves, ShieldAlert, ShieldCheck];
            const SceneIcon = icons[scene.stage - 1];
            const className = `min-h-[104px] rounded-xl border p-3 text-left transition ${selected ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" : "border-slate-200 bg-slate-50/60 hover:border-teal-300 hover:bg-white"}`;
            const contents = (
              <>
                <div className="flex items-center justify-between gap-2">
                  <SceneIcon size={18} className={selected ? "text-teal-700" : "text-slate-500"} aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{selected ? "Active" : "Scene " + scene.stage}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900">{scene.label}</p>
                <p className="mt-1 text-xs leading-4 text-slate-600">{scene.subtitle}</p>
              </>
            );
            return readOnly
              ? <div key={scene.stage} className={className} aria-current={selected ? "step" : undefined}>{contents}</div>
              : <button key={scene.stage} type="button" aria-pressed={selected} disabled={busy || !operatorKey}
                  onClick={() => void selectPreset(scene.stage)} className={className + " disabled:cursor-not-allowed disabled:opacity-60"}>{contents}</button>;
          })}
        </div>
        {scenario ? <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
          <p className="max-w-3xl text-xs leading-5 text-slate-700"><strong>Scene {scenario.stage}:</strong> {DEMO_PRESETS.find(item => item.stage === scenario.stage)?.detail}</p>
          <a href="#demo-network" className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-teal-800 hover:underline">See road changes <ArrowDownRight size={14}/></a>
        </div> : null}
      </div>
      {message ? <p role="status" className="mt-3 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm font-medium text-teal-900">{message}</p> : null}
      {readOnly ? <p className="mt-2 text-sm text-slate-600">Current fictional scenario. Stages are controlled from the management demonstration.</p> : null}
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
          {!readOnly ? <div className="mt-4 flex justify-end">
            <button type="button" disabled={busy || scenario.stage >= 5 || !operatorKey} onClick={() => void change(scenario.stage + 1)} className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2 font-semibold text-white transition hover:bg-teal-700 disabled:bg-slate-300">
              {busy ? "Updating…" : scenario.stage >= 5 ? "Scenario complete" : "Next stage"} <ChevronRight size={17}/>
            </button>
          </div> : null}
        </>
      ) : !error ? <p className="mt-4 text-sm" role="status">Loading current demo scenario…</p> : null}
    </section>
  );
}
