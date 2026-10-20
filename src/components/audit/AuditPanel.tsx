"use client";
import { useState } from "react";
type Entry = { id:string;action:string;subjectId:string;actor:string;detail:string;createdAt:string };
export default function AuditPanel(){
  const [key,setKey]=useState("");
  const [rows,setRows]=useState<Entry[]>([]);
  const [message,setMessage]=useState("");
  async function load(){
    setMessage("");
    try {
      const response=await fetch("/api/audit",{headers:{"x-demo-operator-key":key},cache:"no-store"});
      const data=await response.json() as {entries?:Entry[];error?:string};
      if(!response.ok) throw new Error(data.error??"Couldn't load demo history");
      setRows(data.entries??[]);
      setMessage("Showing the latest demo report reviews.");
    }catch(err){setRows([]);setMessage(err instanceof Error?err.message:"Could not load history");}
  }
  return <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
    <h2 className="text-xl font-semibold">Demo review history</h2>
    <p className="mt-2 text-sm text-slate-600">An audit entry records who performed a test action, what changed, and when. This is local demo data only.</p>
    <label className="mt-3 block text-sm font-medium">Demo operator key
      <input value={key} onChange={e=>setKey(e.target.value)} type="password" autoComplete="off" className="mt-1 block w-full rounded-lg border p-2" />
    </label>
    <button type="button" disabled={!key} onClick={()=>void load()} className="mt-3 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Load review history</button>
    {message?<p role="status" className="mt-3 text-sm">{message}</p>:null}
    <div className="mt-3 space-y-2">{rows.map(row=><article key={row.id} className="rounded-lg border p-3 text-sm">
      <p className="font-semibold">{row.action.replaceAll("_"," ")} · {row.subjectId}</p>
      <p className="text-slate-600">{row.actor} · {new Date(row.createdAt).toLocaleString()}</p>
      <p className="mt-1 break-words text-xs text-slate-600">{row.detail}</p>
    </article>)}</div>
  </section>;
}
