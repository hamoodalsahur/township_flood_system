import Link from "next/link";
import { ArrowLeft, Bell, Map, MessageSquareWarning } from "lucide-react";
import PrototypeNotice from "@/components/PrototypeNotice";

const plannedFeatures = [
  { title: "Flood & road map", description: "Risk zones, gateway states and observation provenance.", icon: Map },
  { title: "Local advisories", description: "Verified notices relevant to selected township zones.", icon: Bell },
  { title: "Resident reports", description: "Location-scoped reports awaiting operator verification.", icon: MessageSquareWarning },
];

export default function ResidentPage() {
  return (
    <main>
      <PrototypeNotice />
      <div className="mx-auto max-w-4xl px-5 py-10">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-ocean"><ArrowLeft size={16} /> Back to project</Link>
        <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-ocean">Resident experience</p>
        <h1 className="mt-3 text-4xl font-bold">Township access overview</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">Future home for evidence-labelled Bandar Bukit Raja road conditions and flood reports. No live feed, operational map or route assessment is connected yet.</p>
        <div className="mt-9 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Gateway monitoring</h2>
          <p className="mt-2 text-sm text-slate-600">Not implemented — gateway conditions are not available. Do not use this page for travel decisions.</p>
        </div>
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {plannedFeatures.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <feature.icon size={23} className="text-ocean" aria-hidden="true" />
              <h2 className="mt-4 font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              <p className="mt-4 text-xs font-semibold uppercase text-slate-400">Planned feature</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
