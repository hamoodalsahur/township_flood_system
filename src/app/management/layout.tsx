import type {ReactNode} from "react";
import PrototypeNotice from "@/components/PrototypeNotice";
import ManagementShell from "@/components/management/ManagementShell";

/** Persistent App Router layout: sign-in state survives navigation between child pages. */
export default function ManagementLayout({children}:{children:ReactNode}){
  return <main><PrototypeNotice/><ManagementShell>{children}</ManagementShell></main>;
}
