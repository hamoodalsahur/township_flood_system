import PrototypeNotice from "@/components/PrototypeNotice";
import SiteHeader from "@/components/SiteHeader";
import ManagementControls from "@/components/management/ManagementControls";

export default function ManagementPage() {
  return (
    <main>
      <PrototypeNotice />
      <SiteHeader current="management" />
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Operator workspace · local demo</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Management dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Geographic research, fictional scenario controls and report review in one workspace.</p>
        </div>
        <ManagementControls />
      </div>
    </main>
  );
}
