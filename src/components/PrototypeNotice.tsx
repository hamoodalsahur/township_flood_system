import { Info } from "lucide-react";

export default function PrototypeNotice() {
  return (
    <div className="border-b border-amber-200 bg-amber-50/90 px-5 py-2.5 text-amber-950" role="note">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-center text-xs font-medium sm:justify-start">
        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span><strong>Prototype / demonstration only.</strong> Flood scenarios are fictional; mapped OSM roads are unverified. Not live warnings or travel guidance.</span>
      </div>
    </div>
  );
}
