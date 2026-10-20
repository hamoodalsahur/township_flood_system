import Link from "next/link";
import { ArrowRight, MapPinned, ShieldCheck } from "lucide-react";
import PrototypeNotice from "@/components/PrototypeNotice";

export default function HomePage() {
  return (
    <main>
      <PrototypeNotice />
      <section className="mx-auto max-w-5xl px-5 py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-ocean">Sime Darby Property University Hackathon · Foundation build</p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">Township Flood Intelligence &amp; Road Accessibility</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          A proposed last-mile information layer to help communities understand flood-related road disruption and help operators verify incidents.
          Bandar Bukit Raja is our illustrative study area.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link href="/resident" className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-ocean hover:shadow-md">
            <MapPinned className="h-9 w-9 text-ocean" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold">Resident portal</h2>
            <p className="mt-3 text-slate-600">Planned: local flood-risk zones, gateway status, community reporting and evidence-labelled road conditions.</p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-ocean">Explore portal <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
          <Link href="/management" className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-ocean hover:shadow-md">
            <ShieldCheck className="h-9 w-9 text-ocean" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold">Management dashboard</h2>
            <p className="mt-3 text-slate-600">Planned: incident review, operator verification, historical records and priority hotspot analysis.</p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-ocean">Explore dashboard <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
        </div>
        <p className="mt-8 text-sm text-slate-500">This is an interface scaffold only. It does not provide real-time flood alerts, route guidance or emergency services.</p>
      </section>
    </main>
  );
}
