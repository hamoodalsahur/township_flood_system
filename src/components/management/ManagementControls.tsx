"use client";

import { useState } from "react";
import DemoController from "@/components/scenarios/DemoController";
import ReportWorkspace from "@/components/reports/ReportWorkspace";
import AuditPanel from "@/components/audit/AuditPanel";
import MapWorkspace from "@/components/maps/MapWorkspace";
import ConnectivityPanel from "@/components/network/ConnectivityPanel";

export default function ManagementControls() {
  const [operatorKey, setOperatorKey] = useState("");
  return (
    <>
      <section className="mt-8 rounded-xl border border-teal-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Local demo operator controls</h2>
        <p className="mt-2 text-sm text-slate-600">Use one key for reviewing reports, checking history and advancing the fictional flood scenario. This is for development only, not real operator authentication.</p>
        <label className="mt-3 block text-sm font-semibold">
          Demo operator key
          <input type="password" autoComplete="off" value={operatorKey} onChange={event => setOperatorKey(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 p-2" placeholder="Key from your local .env file"/>
        </label>
        <p className="mt-2 text-xs text-slate-500">The key is kept in this page's React state and is not saved to the browser. Don't share it or deploy these demo endpoints publicly.</p>
      </section>
      <DemoController operatorKey={operatorKey} />
      <MapWorkspace variant="management" />
      <ConnectivityPanel />
      <ReportWorkspace view="management" operatorKey={operatorKey} />
      <AuditPanel operatorKey={operatorKey} />
    </>
  );
}
