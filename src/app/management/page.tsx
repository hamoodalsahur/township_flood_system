import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Database, Waves } from "lucide-react";
import PrototypeNotice from "@/components/PrototypeNotice";

const areas = [
  { title: "Incident verification", description: "Review community observations before updating authoritative road states.", icon: ClipboardCheck },
  { title: "4R buffer context", description: "Show clearly labelled simulated wetland, swale and outfall conditions.", icon: Waves },
  { title: "Historical evidence", description: "Record source information and audited operational decisions.", icon: Database },
];

export default function ManagementPage() {
  return (
    <main>
      <PrototypeNotice />
      <div className="mx-auto max-w-5xl px-5 py-10">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-ocean"><ArrowLeft size={16} /> Back to project</Link>
        <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-ocean">Operator experience</p>
        <h1 className="mt-3 text-4xl font-bold">Township management overview</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">Interface foundation for future flood monitoring, report verification and gateway disruption analysis.</p>
        <div className="mt-9 rounded-xl border border-blue-200 bg-white p-6">
          <h2 className="font-semibold">System status</h2>
          <p className="mt-2 text-sm text-slate-600">No live data sources, operator actions or simulation engine are connected. Dashboard values will not be fabricated.</p>
        </div>
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {areas.map((area) => (
            <article key={area.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <area.icon size={23} className="text-ocean" aria-hidden="true" />
              <h2 className="mt-4 font-semibold">{area.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
              <p className="mt-4 text-xs font-semibold uppercase text-slate-400">Planned feature</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
