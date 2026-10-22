import {MANAGEMENT_SECTIONS,type ManagementSectionId} from "@/lib/management-sections";

export default function ManagementSectionHeading({section,eyebrow}:{section:ManagementSectionId;eyebrow?:string}){
 const item=MANAGEMENT_SECTIONS.find(x=>x.id===section);
 if(!item)return null;
 return <div className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
  <div>
   <p className="text-xs font-bold uppercase tracking-[.15em] text-teal-700">{eyebrow||"Management · fictional prototype"}</p>
   <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{item.label}</h1>
   <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{item.description}</p>
  </div>
  <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">Local demo · unverified data</span>
 </div>;
}
