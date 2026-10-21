import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, Layers3, MapPinned, RadioTower, ShieldCheck } from "lucide-react";
import PrototypeNotice from "@/components/PrototypeNotice";
import SiteHeader from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <main>
      <PrototypeNotice />
      <SiteHeader current="home" />
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-600" /> University hackathon prototype
            </span>
            <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.7rem]">
              Better visibility for <span className="text-teal-700">township disruptions.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Explore mapped road geography, test fictional flood scenarios, and see how community reports could support more informed local decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/resident" className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700">
                Explore interactive map <ArrowRight size={17} />
              </Link>
              <Link href="/management" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:border-teal-400 hover:bg-teal-50">
                Management dashboard <ArrowUpRight size={17} />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
              <CheckCircle2 size={15} className="text-teal-700" /> Built for demonstration · no live flood monitoring
            </p>
          </div>
          <div className="relative rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_22px_70px_-45px_rgba(15,41,55,.4)] sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Prototype workspace</p><h2 className="mt-1 text-xl font-bold text-slate-900">Two connected experiences</h2></div>
              <div className="rounded-xl bg-teal-50 p-3 text-teal-700"><Layers3 size={22} /></div>
            </div>
            <div className="mt-6 space-y-3">
              <Link href="/resident" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-300 hover:bg-teal-50">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm"><MapPinned size={24} /></span>
                <span className="flex-1"><strong className="block text-sm text-slate-900">Resident map</strong><span className="mt-1 block text-xs leading-5 text-slate-600">Road layers, source links and area context</span></span>
                <ArrowUpRight size={18} className="text-slate-400 group-hover:text-teal-700" />
              </Link>
              <Link href="/management" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-300 hover:bg-teal-50">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm"><ShieldCheck size={24} /></span>
                <span className="flex-1"><strong className="block text-sm text-slate-900">Operator workspace</strong><span className="mt-1 block text-xs leading-5 text-slate-600">Scenario controls, reviews and audit trail</span></span>
                <ArrowUpRight size={18} className="text-slate-400 group-hover:text-teal-700" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5">
              <div className="text-center"><Compass size={19} className="mx-auto text-teal-700" /><p className="mt-2 text-xs font-semibold">Map context</p></div>
              <div className="text-center"><RadioTower size={19} className="mx-auto text-teal-700" /><p className="mt-2 text-xs font-semibold">Simulation</p></div>
              <div className="text-center"><ShieldCheck size={19} className="mx-auto text-teal-700" /><p className="mt-2 text-xs font-semibold">Review process</p></div>
            </div>
          </div>
        </section>
        <section className="mt-20 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold text-slate-900">Explore the workflow</h2><span className="text-xs font-medium text-slate-500">Bandar Bukit Raja · study-area reference</span></div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", title: "Explore the area", description: "Inspect actual OSM map geometry and source metadata. Geographic accuracy is not independently verified." },
              { n: "02", title: "Run a scenario", description: "Demonstrate fictional flood stages using a separate schematic road network." },
              { n: "03", title: "Review information", description: "Submit and review local test reports with a traceable operator workflow." },
            ].map(item => <article key={item.n} className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-xs font-bold text-teal-700">{item.n}</span><h3 className="mt-3 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p></article>)}
          </div>
        </section>
      </div>
    </main>
  );
}
