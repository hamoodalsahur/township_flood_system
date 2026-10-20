"use client";

import { useCallback, useEffect, useState } from "react";

type Report = { id: string; roadId: string; category: string; description: string; status: string; createdAt: string; reviewNote: string | null };
type Road = { id: string; label: string };

export default function ReportWorkspace({ view, operatorKey = "" }: { view: "resident" | "management"; operatorKey?: string }) {
  const [roads, setRoads] = useState<Road[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [roadId, setRoadId] = useState("");
  const [category, setCategory] = useState("surface_water");
  const [description, setDescription] = useState("");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const [a,b] = await Promise.all([fetch("/api/roads", { cache: "no-store" }),fetch("/api/reports", { cache: "no-store" })]);
      if (!a.ok || !b.ok) throw new Error("Demo database APIs unavailable");
      const roadData = await a.json() as { roads: Road[] };
      const reportData = await b.json() as { reports: Report[] };
      setRoads(roadData.roads);
      setRoadId(current => current || roadData.roads[0]?.id || "");
      setReports(reportData.reports);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load records"); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function submit() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/reports",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({roadId,category,description})});
      const payload = await response.json() as {error?:string};
      if (!response.ok) throw new Error(payload.error || "Could not submit report");
      setDescription("");setMessage("Demo report submitted. It remains unverified and does not close a road.");
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Failed to save report"); } finally { setBusy(false); }
  }

  async function review(id: string, decision: "corroborated" | "rejected") {
    setBusy(true);setMessage("");
    try {
      const response=await fetch(`/api/reports/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json","x-demo-operator-key":operatorKey},body:JSON.stringify({decision,note:reviewNotes[id] || ""})});
      const payload=await response.json() as {error?:string};
      if (!response.ok) throw new Error(payload.error || "Could not review");
      setMessage(`Demo report ${decision}. No road status was changed.`);
      await load();
    } catch(error){setMessage(error instanceof Error ? error.message : "Review failed");}finally{setBusy(false);}
  }

  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Simulation only · no real reports</p>
    <h2 className="mt-1 text-xl font-bold">{view==="resident"?"Submit a demonstration report":"Review demonstration reports"}</h2>
    {view==="resident"?<div className="mt-4 space-y-3">
      <label className="block text-sm font-semibold">Fictional road
        <select value={roadId} onChange={e=>setRoadId(e.target.value)} className="mt-1 block w-full rounded-lg border p-2">{roads.map(road=><option key={road.id} value={road.id}>{road.label}</option>)}</select>
      </label>
      <label className="block text-sm font-semibold">Issue
        <select value={category} onChange={e=>setCategory(e.target.value)} className="mt-1 block w-full rounded-lg border p-2">
          <option value="surface_water">Surface water</option><option value="blocked_drain">Blocked drain</option><option value="road_obstruction">Road obstruction</option>
        </select>
      </label>
      <label className="block text-sm font-semibold">What did you observe? (fictional test description)
        <textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={400} rows={3} className="mt-1 block w-full rounded-lg border p-2" placeholder="Example: Demo puddle near the fictional junction."/>
      </label>
      <button type="button" disabled={busy||!roadId||description.trim().length<8} onClick={()=>void submit()} className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white disabled:opacity-40">Submit demo report</button>
    </div>:<p className="mt-2 text-sm text-slate-600">This queue simulates operator decisions. Enter the local demo operator key before reviewing reports. This is not production authentication.</p>}
    {message?<p role="status" className="mt-3 rounded-lg bg-slate-100 p-3 text-sm">{message}</p>:null}
    <div className="mt-5 space-y-3">
      <h3 className="font-semibold">Recent demo reports ({reports.length})</h3>
      {reports.length===0?<p className="text-sm text-slate-600">No demo reports yet. Submit one from the resident page.</p>:null}
      {reports.map(report=><article key={report.id} className="rounded-lg border border-slate-200 p-3 text-sm">
        <div className="flex flex-wrap justify-between gap-2"><strong>{report.category.replaceAll("_"," ")} · {report.roadId}</strong><span className="font-semibold capitalize">{report.status}</span></div>
        <p className="mt-2 text-slate-600">{report.description}</p>
        {report.reviewNote?<p className="mt-2 text-xs">Review note: {report.reviewNote}</p>:null}
        {view==="management"&&report.status==="unverified"?<div className="mt-3 space-y-2">
          <label className="block text-xs font-semibold">Reason for decision (min 8 characters)
            <input value={reviewNotes[report.id]??""} onChange={e=>setReviewNotes(s=>({...s,[report.id]:e.target.value}))} maxLength={400} className="mt-1 block w-full rounded-lg border p-2"/>
          </label>
          <div className="flex gap-2"><button type="button" disabled={busy||!operatorKey||(reviewNotes[report.id]??"").trim().length<8} onClick={()=>void review(report.id,"corroborated")} className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">Corroborate (demo)</button>
          <button type="button" disabled={busy||(reviewNotes[report.id]??"").trim().length<8} onClick={()=>void review(report.id,"rejected")} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold disabled:opacity-40">Reject (demo)</button></div>
        </div>:null}
      </article>)}
    </div>
  </section>;
}
