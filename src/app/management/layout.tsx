import type {ReactNode} from "react";
import ManagementShell from "@/components/management/ManagementShell";

/** Persistent App Router layout: sign-in state survives navigation between child pages. */
export default function ManagementLayout({children}:{children:ReactNode}){
  return <ManagementShell>{children}</ManagementShell>;
}
