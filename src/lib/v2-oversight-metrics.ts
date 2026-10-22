/** Pure, deterministic fictional incident oversight metrics. */
export type OversightReport={id:string;reviewState:string;createdAt:Date;incidentLink?:{incidentId:string}|null};
export type OversightIncident={id:string;status:string;createdAt:Date;reports:{reportId:string}[];possibleRoad:string|null};
export function deriveOversight(reports:readonly OversightReport[],incidents:readonly OversightIncident[],now=new Date()){
 const unverified=reports.filter(r=>r.reviewState==="unverified");
 const ungrouped=reports.filter(r=>r.reviewState!=="rejected"&&!r.incidentLink);
 const overdue=unverified.filter(r=>now.getTime()-r.createdAt.getTime()>24*3600000&&now>=r.createdAt);
 return {
  totalReports:reports.length,unverifiedReports:unverified.length,overdueUnverified:overdue.length,
  ungroupedReports:ungrouped.length,groupedReports:reports.filter(r=>Boolean(r.incidentLink)).length,
  activeIncidents:incidents.filter(i=>i.status!=="resolved").length,
  resolvedIncidents:incidents.filter(i=>i.status==="resolved").length,
  incidentsUnderReview:incidents.filter(i=>i.status==="under_review").length,
  corroboratedIncidents:incidents.filter(i=>i.status==="corroborated").length,
  possibleRoadReferences:incidents.filter(i=>i.possibleRoad&&i.status!=="resolved").length,
  ageingIncidentIds:incidents.filter(i=>i.status==="under_review"&&now.getTime()-i.createdAt.getTime()>24*3600000&&now>=i.createdAt).map(i=>i.id).slice(0,10),
  multiReportIncidents:incidents.filter(i=>i.reports.length>=2).length
 };
}
