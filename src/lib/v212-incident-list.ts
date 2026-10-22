/** Presentation-only filters for fictional managed incidents.
 * These never modify statuses, links, audit entries or road records.
 */
export type IncidentListItem={
 id:string;title:string;category:string;status:string;possibleRoad:string|null;createdAt:string;
};
export type IncidentListFilters={
 query:string;status:string;category:string;sort:"newest"|"oldest";
};
export function filterIncidentGroups<T extends IncidentListItem>(
 incidents:readonly T[],filters:IncidentListFilters
):T[]{
 const query=filters.query.trim().toLocaleLowerCase();
 const matches=incidents.filter(i=>
  (filters.status==="all"||i.status===filters.status)&&
  (filters.category==="all"||i.category===filters.category)&&
  (!query||[i.title,i.id,i.category,i.possibleRoad??""].some(x=>x.toLocaleLowerCase().includes(query)))
 );
 return matches.sort((a,b)=>{
  const dateA=Date.parse(a.createdAt),dateB=Date.parse(b.createdAt);
  const diff=(Number.isFinite(dateA)?dateA:0)-(Number.isFinite(dateB)?dateB:0);
  return (filters.sort==="newest"?-diff:diff)||a.id.localeCompare(b.id);
 });
}
export function incidentStatusCounts<T extends {status:string}>(items:readonly T[]){
 return {total:items.length,underReview:items.filter(x=>x.status==="under_review").length,
  corroborated:items.filter(x=>x.status==="corroborated").length,
  resolved:items.filter(x=>x.status==="resolved").length};
}
