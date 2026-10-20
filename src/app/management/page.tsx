import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrototypeNotice from "@/components/PrototypeNotice";
import ManagementControls from "@/components/management/ManagementControls";
export default function ManagementPage() {
  return (
    <main>
      <PrototypeNotice />
      <div className="mx-auto max-w-7xl px-5 py-10">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-ocean"><ArrowLeft size={16} /> Back to project</Link>
        <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-ocean">Operator experience · local prototype</p>
        <h1 className="mt-3 text-4xl font-bold">Township management overview</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          This shared network view retrieves the same database records as the resident portal. Demo reports, review history and scenario controls are available below. No live hydrological data or real road-closure operations are connected.
        </p>
        <ManagementControls />
      </div>
    </main>
  );
}
