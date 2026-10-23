import {MANAGEMENT_SECTIONS,type ManagementSectionId} from "@/lib/management-sections";

export default function ManagementSectionHeading({section}:{section:ManagementSectionId;eyebrow?:string}){
  const item=MANAGEMENT_SECTIONS.find(x=>x.id===section);
  if(!item)return null;
  return <div className="mb-6">
    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{item.label}</h1>
    <p className="mt-1 max-w-3xl text-sm text-slate-500">{item.description}</p>
  </div>;
}
