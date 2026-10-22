"use client";

import { useState, type FormEvent } from "react";
import { LockKeyhole, LogOut } from "lucide-react";
import DemoController from "@/components/scenarios/DemoController";
import ReportWorkspace from "@/components/reports/ReportWorkspace";
import AuditPanel from "@/components/audit/AuditPanel";
import OperatorAuditSummary from "@/components/management/OperatorAuditSummary";
import MapWorkspace from "@/components/maps/MapWorkspace";
import GeographicReferenceWorkspace from "@/components/maps/GeographicReferenceWorkspace";
import ConnectivityPanel from "@/components/network/ConnectivityPanel";
import V2HazardManager from "@/components/management/V2HazardManager";
import IncidentManager from "@/components/management/IncidentManager";
import IncidentOversight from "@/components/management/IncidentOversight";
import ReviewAgeQueue from "@/components/management/ReviewAgeQueue";
import EvidenceInventory from "@/components/management/EvidenceInventory";
import EvidenceConsistency from "@/components/management/EvidenceConsistency";
import DemoDataQuality from "@/components/management/DemoDataQuality";
import ResearchExport from "@/components/management/ResearchExport";
import RoadTopologyQuality from "@/components/management/RoadTopologyQuality";
import GeoSourceManifest from "@/components/management/GeoSourceManifest";
import RoadAccessTags from "@/components/management/RoadAccessTags";
import AiEvaluationWorkbench from "@/components/management/AiEvaluationWorkbench";

export default function ManagementControls() {
  const [password, setPassword] = useState("");
  const [operatorKey, setOperatorKey] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setChecking(true);
    try {
      // Reuse our existing local operator-key check; no new login API needed.
      const response = await fetch("/api/audit", {
        headers: { "x-demo-operator-key": password },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(response.status === 403 ? "Incorrect password. Please try again." : "Couldn't check the demo password. Is your server running?");
      }
      setOperatorKey(password);
      setPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setChecking(false);
    }
  }

  if (!operatorKey) {
    return (
      <section className="mx-auto mt-12 max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-45px_rgba(15,41,55,.4)] sm:p-8">
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-teal-50 p-3"><LockKeyhole className="text-teal-700" size={28} /></div>
          <h2 className="text-2xl font-bold">Management Login</h2>
          <p className="text-sm text-slate-600">Enter your local demo operator password to view the dashboard.</p>
        </div>
        <form onSubmit={event => void login(event)} className="space-y-4">
          <label className="block text-sm font-semibold">
            Password
            <input type="password" autoComplete="off" value={password} onChange={event => setPassword(event.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 p-3" placeholder="Password from your .env file" required />
          </label>
          {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
          <button type="submit" disabled={checking || !password} className="w-full rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white disabled:opacity-50">
            {checking ? "Checking…" : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-500">Local development demo only. This is not a production account login.</p>
      </section>
    );
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 p-3.5">
        <p className="text-sm font-semibold text-teal-900">Demo management dashboard unlocked</p>
        <button type="button" onClick={() => { setOperatorKey(""); setPassword(""); setError(""); }}
          className="inline-flex items-center gap-2 rounded-lg border border-teal-300 bg-white px-4 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-100">
          <LogOut size={16} /> Log out
        </button>
      </div>
      <GeographicReferenceWorkspace />
      <section id="operations" className="scroll-mt-6 pt-12">
        <div className="border-b border-slate-200 pb-4"><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Demonstration controls · fictional scenario</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Simulation operations</h2><p className="mt-1 text-sm leading-6 text-slate-600">Advance the fictional stages and explore their effect on a separate schematic network.</p></div>
        <DemoController operatorKey={operatorKey} />
        <MapWorkspace variant="management" />
        <ConnectivityPanel />
      </section>
      <section className="pt-8" id="review-queue">
        <div className="border-b border-slate-200 pb-4"><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Operator workflow · demonstration records</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Reports and review history</h2></div>
        <AiEvaluationWorkbench operatorKey={operatorKey} />
        <IncidentOversight operatorKey={operatorKey} />
        <ReviewAgeQueue operatorKey={operatorKey} />
        <EvidenceInventory operatorKey={operatorKey} />
        <EvidenceConsistency operatorKey={operatorKey} />
        <DemoDataQuality operatorKey={operatorKey} />
        <ResearchExport operatorKey={operatorKey} />
        <RoadTopologyQuality operatorKey={operatorKey} />
        <GeoSourceManifest operatorKey={operatorKey} />
        <RoadAccessTags operatorKey={operatorKey} />
        <IncidentManager operatorKey={operatorKey} />
        <V2HazardManager operatorKey={operatorKey} />
        <ReportWorkspace view="management" operatorKey={operatorKey} />
        <OperatorAuditSummary operatorKey={operatorKey} />
        <AuditPanel operatorKey={operatorKey} />
      </section>
    </>
  );
}
