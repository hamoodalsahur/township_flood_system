import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrototypeNotice from "@/components/PrototypeNotice";
import MapWorkspace from "@/components/maps/MapWorkspace";
import DemoController from "@/components/scenarios/DemoController";

export default function ResidentPage() {
  return (
    <main>
      <PrototypeNotice />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-ocean"><ArrowLeft size={16} /> Back to project</Link>
        <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-ocean">Resident experience · Phase 1B</p>
        <h1 className="mt-3 text-4xl font-bold">Township access overview</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Explore the connected demonstration zones and roads. This interface illustrates how verified observations
          could eventually appear; it has no real road conditions or route guidance.
        </p>
        <DemoController />
        <MapWorkspace variant="resident" />
      </div>
    </main>
  );
}
