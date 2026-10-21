import { ArrowDownRight, Layers, MapPinned } from "lucide-react";
import PrototypeNotice from "@/components/PrototypeNotice";
import SiteHeader from "@/components/SiteHeader";
import MapWorkspace from "@/components/maps/MapWorkspace";
import GeographicReferenceWorkspace from "@/components/maps/GeographicReferenceWorkspace";
import DemoController from "@/components/scenarios/DemoController";
import ConnectivityPanel from "@/components/network/ConnectivityPanel";
import ReportWorkspace from "@/components/reports/ReportWorkspace";

export default function ResidentPage() {
  return (
    <main>
      <PrototypeNotice />
      <SiteHeader current="resident" />
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Resident experience · Interactive prototype</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Explore Bandar Bukit Raja</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Start with the mapped roads below, then explore the separate flood simulation and reporting workflow.</p>
          </div>
          <a href="#simulation" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
            View simulation <ArrowDownRight size={16} />
          </a>
        </div>
        <div id="area-map"><GeographicReferenceWorkspace /></div>
        <section id="simulation" className="scroll-mt-6 pt-12">
          <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
            <span className="rounded-xl bg-teal-50 p-2.5 text-teal-700"><Layers size={20} /></span>
            <div><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Demo lab · fictional data</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Explore the flood scenario</h2><p className="mt-1 text-sm text-slate-600">A separate schematic network illustrates how conditions might be assessed. It does not represent live roads.</p></div>
          </div>
          <DemoController readOnly />
          <MapWorkspace variant="resident" />
          <ConnectivityPanel />
        </section>
        <section id="reports" className="scroll-mt-6 pt-8">
          <div className="flex items-center gap-3"><MapPinned size={21} className="text-teal-700" /><h2 className="text-2xl font-bold tracking-tight">Community reporting demo</h2></div>
          <p className="mt-2 text-sm text-slate-600">Practice submitting a fictional issue to understand the review process.</p>
          <ReportWorkspace view="resident" />
        </section>
      </div>
    </main>
  );
}
