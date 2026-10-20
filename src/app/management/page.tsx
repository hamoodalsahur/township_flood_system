import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrototypeNotice from "@/components/PrototypeNotice";
import MapWorkspace from "@/components/maps/MapWorkspace";

export default function ManagementPage() {
  return (
    <main>
      <PrototypeNotice />
      <div className="mx-auto max-w-7xl px-5 py-10">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-ocean"><ArrowLeft size={16} /> Back to project</Link>
        <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-ocean">Operator experience · Phase 1B</p>
        <h1 className="mt-3 text-4xl font-bold">Township management overview</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          This shared network view retrieves the same database records as the resident portal. Verification actions,
          incident management and actual 4R hydrological information are not connected yet.
        </p>
        <MapWorkspace variant="management" />
      </div>
    </main>
  );
}
