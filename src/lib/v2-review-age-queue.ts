/** Metadata-only, read-only review age indicators for fictional local demo records.
 * Age is never a real-world severity score, emergency priority, or verified hazard signal.
 */
export type QueuedReport = {id:string;category:string;reviewState:string;createdAt:Date;incidentLink:{incidentId:string}|null};
export type QueuedIncident = {id:string;category:string;status:string;createdAt:Date};
export type ReviewAgeEntry={
  id:string;
  kind:"report"|"incident";
  category:string;
  state:string;
  ageHours:number;
  ageBand:"under_24h"|"24_to_72h"|"over_72h";
  grouped?:boolean;
};
export type ReviewAgeSummary={
  eligibleCount:number;
  olderThan24h:number;
  olderThan72h:number;
  futureOrInvalidDates:number;
  entries:ReviewAgeEntry[];
  truncated:boolean;
  disclaimer:string;
};
const HOUR=60*60*1000;

export function deriveReviewAgeQueue(
  reports:readonly QueuedReport[],
  incidents:readonly QueuedIncident[],
  now=new Date(),
  displayLimit=12
):ReviewAgeSummary{
  if(!Number.isSafeInteger(displayLimit)||displayLimit<1||displayLimit>50)throw new RangeError("Invalid queue size");
  const candidates=[
    ...reports.filter(r=>r.reviewState==="unverified").map(r=>({
      id:r.id,kind:"report" as const,category:r.category,state:r.reviewState,createdAt:r.createdAt,grouped:Boolean(r.incidentLink)
    })),
    ...incidents.filter(i=>i.status==="under_review").map(i=>({
      id:i.id,kind:"incident" as const,category:i.category,state:i.status,createdAt:i.createdAt
    }))
  ];
  let futureOrInvalidDates=0;
  const entries:ReviewAgeEntry[]=candidates.flatMap(item=>{
    const age=(now.getTime()-item.createdAt.getTime())/HOUR;
    if(!Number.isFinite(age)||age<0){futureOrInvalidDates++;return [];}
    return [{
      id:item.id,kind:item.kind,category:item.category,state:item.state,
      ageHours:Math.floor(age),
      ageBand:age>=72?"over_72h" as const:age>=24?"24_to_72h" as const:"under_24h" as const,
      ...("grouped" in item?{grouped:item.grouped}:{})
    }];
  }).sort((a,b)=>b.ageHours-a.ageHours||a.kind.localeCompare(b.kind)||a.id.localeCompare(b.id));
  return {
    eligibleCount:entries.length,
    olderThan24h:entries.filter(x=>x.ageHours>=24).length,
    olderThan72h:entries.filter(x=>x.ageHours>=72).length,
    futureOrInvalidDates,
    entries:entries.slice(0,displayLimit),
    truncated:entries.length>displayLimit,
    disclaimer:"Fictional local review age only. Queue position reflects record timestamps, not incident severity, real hazard conditions, dispatch priority or road safety. No decisions or database writes are made."
  };
}
