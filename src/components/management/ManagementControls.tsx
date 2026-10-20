"use client";

import { useState, type FormEvent } from "react";
import { LockKeyhole, LogOut } from "lucide-react";
import DemoController from "@/components/scenarios/DemoController";
import ReportWorkspace from "@/components/reports/ReportWorkspace";
import AuditPanel from "@/components/audit/AuditPanel";
import MapWorkspace from "@/components/maps/MapWorkspace";
import GeographicReferenceWorkspace from "@/components/maps/GeographicReferenceWorkspace";
import ConnectivityPanel from "@/components/network/ConnectivityPanel";

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
      <section className="mx-auto mt-12 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
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
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
        <p className="text-sm font-semibold text-teal-900">Demo management dashboard unlocked</p>
        <button type="button" onClick={() => { setOperatorKey(""); setPassword(""); setError(""); }}
          className="inline-flex items-center gap-2 rounded-lg border border-teal-300 bg-white px-4 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-100">
          <LogOut size={16} /> Log out
        </button>
      </div>
      <DemoController operatorKey={operatorKey} />
      <MapWorkspace variant="management" />
      <GeographicReferenceWorkspace />
      <ConnectivityPanel />
      <ReportWorkspace view="management" operatorKey={operatorKey} />
      <AuditPanel operatorKey={operatorKey} />
    </>
  );
}
