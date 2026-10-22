"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {createContext,useContext,useState,type FormEvent,type ReactNode} from "react";
import {ArrowUpRight,LockKeyhole,LogOut,Waves} from "lucide-react";
import {MANAGEMENT_SECTIONS,managementSectionFromPath} from "@/lib/management-sections";

const OperatorKeyContext=createContext<string|null>(null);

/** Key is kept in React memory only across management child-route transitions.
 * Refresh/logout requires sign-in. Never persist it in a URL, cookie, or browser storage.
 */
export function useManagementOperatorKey():string{
  const key=useContext(OperatorKeyContext);
  if(!key)throw new Error("Management operator context unavailable");
  return key;
}

export default function ManagementShell({children}:{children:ReactNode}){
  const pathname=usePathname();
  const active=managementSectionFromPath(pathname);
  const [password,setPassword]=useState("");
  const [operatorKey,setOperatorKey]=useState("");
  const [error,setError]=useState("");
  const [checking,setChecking]=useState(false);

  async function login(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setError("");setChecking(true);
    try{
      const response=await fetch("/api/audit",{
        headers:{"x-demo-operator-key":password},cache:"no-store"
      });
      if(!response.ok)throw new Error(response.status===403
        ?"Incorrect demo password. Please try again."
        :"Could not verify the local demo key. Check the development server.");
      setOperatorKey(password);
      setPassword("");
    }catch(cause){
      setError(cause instanceof Error?cause.message:"Unable to sign in");
    }finally{setChecking(false);}
  }

  function logout(){
    setOperatorKey("");
    setPassword("");
    setError("");
  }

  return <>
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur" aria-label="Operator navigation header">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-slate-900" aria-label="Township Flood Intelligence home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white"><Waves size={21} aria-hidden="true"/></span>
          <span>
            <strong className="block text-sm leading-5">Township Road & Hazard</strong>
            <span className="block text-[11px] font-medium text-slate-500">Intelligence · fictional local demo</span>
          </span>
        </Link>
        {operatorKey?<nav className="order-3 w-full overflow-x-auto overscroll-x-contain border-t border-slate-100 pt-2 lg:order-2 lg:w-auto lg:flex-1 lg:border-0 lg:px-4 lg:pt-0"
            aria-label="Management sections">
          <div className="flex min-w-max items-center gap-1">
            {MANAGEMENT_SECTIONS.map(section=><Link key={section.id} href={section.href}
              aria-current={active===section.id?"page":undefined}
              className={"inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm "+
                (active===section.id?"bg-teal-50 text-teal-900 ring-1 ring-teal-200":"text-slate-600 hover:bg-slate-50 hover:text-teal-900")}>
              {section.label}
            </Link>)}
          </div>
        </nav>:<p className="hidden text-xs text-slate-500 sm:block">Local operator access required</p>}
        <div className="order-2 flex items-center gap-2 lg:order-3">
          <Link href="/resident" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            Resident <ArrowUpRight size={13} aria-hidden="true"/>
          </Link>
          {operatorKey?<button type="button" onClick={logout} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <LogOut size={15} aria-hidden="true"/> Log out
          </button>:null}
        </div>
      </div>
    </header>
    {operatorKey?
      <OperatorKeyContext.Provider value={operatorKey}>
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-7 sm:px-8 sm:pt-10">
          <p className="mb-5 text-xs font-medium text-slate-500">Operator workspace / Local development only · No live warnings or verified road decisions</p>
          {children}
        </div>
      </OperatorKeyContext.Provider>
    :
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <section className="mx-auto mt-12 max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-45px_rgba(15,41,55,.4)] sm:p-8" aria-label="Management login">
          <div className="mb-5 flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-teal-50 p-3"><LockKeyhole size={26} className="text-teal-700" aria-hidden="true"/></div>
            <h1 className="text-2xl font-bold">Management sign in</h1>
            <p className="text-sm text-slate-600">Enter your existing local demo operator password to access the six management pages.</p>
          </div>
          <form onSubmit={event=>void login(event)} className="space-y-4">
            <label className="block text-sm font-semibold">
              Demo password
              <input type="password" autoComplete="off" required value={password}
                onChange={event=>setPassword(event.target.value)}
                className="mt-2 block w-full rounded-lg border border-slate-300 p-3" placeholder="Password from your private .env"/>
            </label>
            {error?<p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>:null}
            <button type="submit" disabled={checking||!password}
              className="w-full rounded-lg bg-teal-800 px-4 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50">
              {checking?"Verifying…":"Log in"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">Key stays in memory only. Refresh and logout require sign-in again. Not production authentication.</p>
        </section>
      </div>
    }
  </>;
}
