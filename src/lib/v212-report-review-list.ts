/** Read-only client-side view helpers for fictional geographic report reviews.
 * The underlying report-review API and manual photo decisions are unchanged.
 */
export type ReviewListReport={
 id:string;category:string;description:string;reviewState:string;createdAt:string;
};
export type ReviewListFilters={
 query:string;category:string;reviewState:string;order:"needs_review_first"|"newest"|"oldest";
};

export function filterReviewReports<T extends ReviewListReport>(
  reports:readonly T[],filters:ReviewListFilters
):T[]{
 const term=filters.query.trim().toLocaleLowerCase();
 const matching=reports.filter(report=>
  (filters.category==="all"||report.category===filters.category)&&
  (filters.reviewState==="all"||report.reviewState===filters.reviewState)&&
  (!term||[report.id,report.category,report.description].some(x=>x.toLocaleLowerCase().includes(term)))
 );
 return matching.sort((a,b)=>{
  if(filters.order==="needs_review_first"&&a.reviewState!==b.reviewState){
    if(a.reviewState==="unverified")return -1;
    if(b.reviewState==="unverified")return 1;
  }
  const aTime=Date.parse(a.createdAt),bTime=Date.parse(b.createdAt);
  const delta=(Number.isFinite(aTime)?aTime:0)-(Number.isFinite(bTime)?bTime:0);
  return (filters.order==="oldest"?delta:-delta)||a.id.localeCompare(b.id);
 });
}

export function reportReviewCounts(items:readonly {reviewState:string}[]){
 return {total:items.length,unverified:items.filter(i=>i.reviewState==="unverified").length,
  corroborated:items.filter(i=>i.reviewState==="corroborated").length};
}
