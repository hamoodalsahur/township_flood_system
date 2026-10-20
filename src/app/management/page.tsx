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
        <ManagementControls />
      </div>
    </main>
  );
}
