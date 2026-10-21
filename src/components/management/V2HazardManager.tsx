"use client";
import { useEffect, useState } from "react";
import { CATEGORY_LABELS, type HazardCategory } from "@/lib/demo-hazards";
import { relatedReports } from "@/lib/v2-related-reports";
type RecordItem={id:string;category:string;description:string;impact:string;reviewState:string;createdAt:string;latitude:number;longitude:number;reviewNote?:string|null;hasEvidence?:boolean;evidenceStatus?:string|null};
export default function V2HazardManager({operatorKey}:{operatorKey:string}) {
  const [items,setItems]=useState<RecordItem[]>([]);
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [publishPhotos,setPublishPhotos]=useState<Record<string,boolean>>({});
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const [evidenceUrls,setEvidenceUrls]=useState<Record<string,string>>({});
  const [aiResults,setAiResults]=useState<Record<string,{provider:string;model:string;analysed:number;matches:{id:string;similarity:number;category:string}[];disclaimer:string}>>({});
  const [aiErrors,setAiErrors]=useState<Record<string,string>>({});
  const [aiBusy,setAiBusy]=useState<string|null>(null);
  const [pairNotes,setPairNotes]=useState<Record<string,string>>({});
  const [pairHistory,setPairHistory]=useState<Record<string,{candidateId:string;judgement:string;note:string;updatedAt:string}[]>>({});
  const [pairBusy,setPairBusy]=useState<string|null>(null);
  const [pairStatus,setPairStatus]=useState<Record<string,string>>({});
  const [feedbackSummary,setFeedbackSummary]=useState<{displayed:number;sameEvent:number;differentEvent:number}|null>(null);
  async function loadFeedbackSummary() {
    try {
      const response=await fetch("/api/v2/management/ai-feedback-summary",{
        headers:{"x-demo-operator-key":operatorKey},cache:"no-store"
      });
      if(!response.ok)return;
      const data=await response.json() as {displayed:number;sameEvent:number;differentEvent:number};
      setFeedbackSummary(data);
    }catch{ /* Summary is supplemental; core reports still load. */ }
  }
  async function loadPairHistory(reportId:string) {
    const response=await fetch("/api/v2/hazards/"+reportId+"/ai-feedback",{
      headers:{"x-demo-operator-key":operatorKey},cache:"no-store"
    });
    if(!response.ok)throw Error("Could not load operator match decisions");
    const data=await response.json() as {decisions:{candidateId:string;judgement:string;note:string;updatedAt:string}[]};
    setPairHistory(old=>({...old,[reportId]:data.decisions}));
  }
  async function savePairDecision(reportId:string,candidateId:string,judgement:"same_event"|"different_event") {
    const key=reportId+":"+candidateId;
    setPairBusy(key);setPairStatus(old=>({...old,[key]:""}));
    try {
      const response=await fetch("/api/v2/hazards/"+reportId+"/ai-feedback",{
        method:"POST",headers:{"Content-Type":"application/json","x-demo-operator-key":operatorKey},
        body:JSON.stringify({candidateId,judgement,note:pairNotes[key]??""})
      });
      const data=await response.json() as {error?:string};
      if(!response.ok)throw Error(data.error??"Could not record feedback");
      await loadPairHistory(reportId);
      await loadFeedbackSummary();
      setPairStatus(old=>({...old,[key]:"Saved as a fictional reviewer judgement."}));
    }catch(error){setPairStatus(old=>({...old,[key]:error instanceof Error?error.message:"Could not record feedback"}));}
    finally{setPairBusy(null);}
  }
  async function runAiAnalysis(id:string) {
    setAiBusy(id);setAiErrors(old=>({...old,[id]:""}));
    try {
      const response=await fetch("/api/v2/hazards/"+id+"/ai-triage",{method:"POST",headers:{"x-demo-operator-key":operatorKey}});
      const result=await response.json() as {error?:string;provider:string;model:string;analysed:number;matches:{id:string;similarity:number;category:string}[];disclaimer:string};
      if(!response.ok)throw Error(result.error??"AI comparison failed");
      setAiResults(old=>({...old,[id]:result}));
      await loadPairHistory(id);
    }catch(error){setAiErrors(old=>({...old,[id]:error instanceof Error?error.message:"AI unavailable"}));}
    finally{setAiBusy(null);}
  }
  async function viewEvidence(id:string) {
    setMessage("");
    try {
      const response=await fetch("/api/v2/hazards/"+id+"/evidence/private",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"});
      if(!response.ok)throw Error(response.status===404?"No private photo is attached to this report.":"Could not retrieve private photo.");
      const blob=await response.blob();
      const url=URL.createObjectURL(blob);
      setEvidenceUrls(old=>{if(old[id])URL.revokeObjectURL(old[id]);return {...old,[id]:url};});
    }catch(error){setMessage(error instanceof Error?error.message:"Could not open evidence");}
  }
  async function reload() {
    try {
      const r=await fetch("/api/v2/management/hazards",{cache:"no-store",headers:{"x-demo-operator-key":operatorKey}});
      if(!r.ok) throw Error("Could not load demo hazards. Run npm run db:push.");
      const data=await r.json() as {reports:RecordItem[]};
      setItems(data.reports);
      await loadFeedbackSummary();
    } catch(e){ setMessage(e instanceof Error?e.message:"Unable to load demo reports"); }
  }
  useEffect(()=>{void reload();},[]);
  async function review(id:string,decision:"corroborated"|"rejected") {
    setBusy(true);setMessage("");
    try {
      const response=await fetch(`/api/v2/hazards/${id}/review`,{
        method:"PATCH",headers:{"Content-Type":"application/json","x-demo-operator-key":operatorKey},
        body:JSON.stringify({decision,note:notes[id]??"",publishPhoto:decision==="corroborated"&&publishPhotos[id]===true})
      });
      const result=await response.json() as {error?:string};
      if(!response.ok)throw Error(result.error??"Review failed");
      setMessage("Fictional incident report reviewed. No official road status changed.");
      window.dispatchEvent(new Event("township-hazards-updated"));
      await reload();
    }catch(e){setMessage(e instanceof Error?e.message:"Could not review");}
    finally{setBusy(false);}
  }
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-label="Geographic demo report review">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-bold uppercase tracking-wider text-teal-700">V2 · fictional incident intake</p><h2 className="mt-1 text-xl font-bold">Geographic hazard report review</h2></div>
      <button type="button" onClick={()=>void reload()} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">Refresh reports</button>
    </div>
    <p className="mt-2 text-sm text-slate-600">Separate from the old demonstration flood report queue. Includes rejected reports for management history. Corroboration does not verify a road closure.</p>
    {message?<p role="status" className="mt-3 text-sm text-teal-800">{message}</p>:null}
    <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-xs text-indigo-950">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold">Human incident-pair feedback (fictional study)</p>
        <button type="button" onClick={()=>void loadFeedbackSummary()} className="rounded-lg border border-indigo-300 bg-white px-3 py-1.5 font-semibold">Refresh feedback counts</button>
      </div>
      {feedbackSummary?<p className="mt-2">Last {feedbackSummary.displayed} recorded pair decision(s): {feedbackSummary.sameEvent} same-event and {feedbackSummary.differentEvent} different-event.</p>:<p className="mt-2">No feedback summary available yet.</p>}
      <p className="mt-1">These are operator labels, not measured AI accuracy or verified real incidents. Use the local AI benchmark for preliminary accuracy testing.</p>
    </div>
    <div className="mt-4 space-y-3">
      {items.length===0?<p className="text-sm text-slate-500">No geographic demo reports yet. Submit one from the resident map.</p>:null}
      {items.map(item=><article key={item.id} className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><strong>{CATEGORY_LABELS[item.category as HazardCategory]??item.category}</strong><span className="text-xs font-bold uppercase text-orange-700">{item.reviewState} · DEMO</span></div>
        <p className="mt-1 text-sm text-slate-700">{item.description}</p>
        {item.reviewState==="unverified" ? <p className="mt-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900">Rule-based triage (not AI): {relatedReports(item,items).priority.replaceAll("_"," ")}. Possible related report IDs: {relatedReports(item,items).ids.join(", ")||"none"}. Operator review required.</p> : null}
        {item.reviewState==="unverified"?<div className="mt-2 rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs text-violet-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="font-bold">AI semantic matching · optional</p><p className="mt-1">Compare fictional descriptions with a model. Human review required.</p></div>
            <button type="button" disabled={aiBusy!==null} onClick={()=>void runAiAnalysis(item.id)} className="rounded-lg bg-violet-800 px-3 py-2 font-semibold text-white disabled:opacity-50">{aiBusy===item.id?"Analysing…":"Run AI comparison"}</button>
          </div>
          {aiErrors[item.id]?<p role="status" className="mt-2 text-rose-800">{aiErrors[item.id]}</p>:null}
          {aiResults[item.id]?<div className="mt-3 space-y-1">
            <p className="font-semibold">Provider: {aiResults[item.id].provider} · Model: {aiResults[item.id].model} · compared {aiResults[item.id].analysed} reports</p>
            {aiResults[item.id].matches.length ? aiResults[item.id].matches.map(match=>{
              const pairKey=item.id+":"+match.id;
              const previous=pairHistory[item.id]?.find(row=>row.candidateId===match.id);
              return <div key={match.id} className="mt-2 rounded-lg border border-violet-200 bg-white p-3">
                <p className="font-semibold">Possible match: {match.id}</p>
                <p>Cosine similarity: {(match.similarity*100).toFixed(1)}% · {match.category.replaceAll("_"," ")}. Not a calibrated confidence level.</p>
                {previous?<p className="mt-1 text-teal-800">Recorded judgement: {previous.judgement.replaceAll("_"," ")} · {previous.note}</p>:null}
                <label className="mt-2 block font-semibold">Operator comparison reason
                  <input value={pairNotes[pairKey]??""} maxLength={400}
                    onChange={e=>setPairNotes(old=>({...old,[pairKey]:e.target.value}))}
                    placeholder="Explain why these fictional reports match or differ (8–400 characters)"
                    className="mt-1 block w-full rounded-lg border border-slate-300 p-2 font-normal"/>
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" disabled={pairBusy!==null||(pairNotes[pairKey]??"").trim().length<8}
                    onClick={()=>void savePairDecision(item.id,match.id,"same_event")}
                    className="rounded-lg bg-teal-800 px-3 py-2 font-semibold text-white disabled:opacity-40">Same fictional event</button>
                  <button type="button" disabled={pairBusy!==null||(pairNotes[pairKey]??"").trim().length<8}
                    onClick={()=>void savePairDecision(item.id,match.id,"different_event")}
                    className="rounded-lg border border-slate-300 px-3 py-2 font-semibold disabled:opacity-40">Different events</button>
                </div>
                {pairStatus[pairKey]?<p role="status" className="mt-2 text-slate-700">{pairStatus[pairKey]}</p>:null}
              </div>;
            }) : <p>No strong semantic matches found.</p>}
            <p className="mt-2 text-violet-800">{aiResults[item.id].disclaimer}</p>
          </div>:null}
        </div>:null}
        <p className="mt-1 text-xs text-slate-500">Submitted impact: {item.impact.replaceAll("_"," ")} · {new Date(item.createdAt).toLocaleString()}</p>
        {item.reviewState!=="unverified"?<p className="mt-1 text-xs text-slate-600">Management note: {item.reviewNote??"Not recorded"} · Photo: {item.evidenceStatus??"No image"}</p>:null}
        <div className="mt-3">
          <button type="button" onClick={()=>void viewEvidence(item.id)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">View attached private photo (if any)</button>
          {evidenceUrls[item.id] ? <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <img src={evidenceUrls[item.id]} alt={"Private demonstration evidence for "+item.category} className="max-h-64 max-w-full rounded object-contain" />
            <p className="mt-2 text-xs text-amber-950">Local operator inspection only. This image is not public, verified, or evidence of real road safety.</p>
            <button type="button" className="mt-2 text-xs font-semibold underline" onClick={()=>{URL.revokeObjectURL(evidenceUrls[item.id]);setEvidenceUrls(old=>{const next={...old};delete next[item.id];return next;});}}>Hide photo</button>
          </div> : null}
        </div>
        {item.reviewState==="unverified"?<div className="mt-3 space-y-2">
          <label className="block text-xs font-semibold">Review reason
            <input value={notes[item.id]??""} onChange={e=>setNotes(old=>({...old,[item.id]:e.target.value}))} maxLength={400} className="mt-1 block w-full rounded-lg border border-slate-300 p-2" placeholder="At least 8 characters" />
          </label>
          <label className="flex items-start gap-2 text-xs text-slate-700"><input type="checkbox" checked={publishPhotos[item.id]===true} onChange={e=>setPublishPhotos(prev=>({...prev,[item.id]:e.target.checked}))} /> Separately approve the attached sample photo for public demonstration (only if no identifiable people or private details). Otherwise keep it private.</label>
          <div className="flex gap-2">
            <button type="button" disabled={busy||(notes[item.id]??"").trim().length<8} onClick={()=>void review(item.id,"corroborated")} className="rounded-lg bg-teal-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">Corroborate report</button>
            <button type="button" disabled={busy||(notes[item.id]??"").trim().length<8} onClick={()=>void review(item.id,"rejected")} className="rounded-lg border border-slate-300 px-3 py-2 text-xs disabled:opacity-40">Reject report</button>
          </div>
        </div>:null}
      </article>)}
    </div>
  </section>;
}
