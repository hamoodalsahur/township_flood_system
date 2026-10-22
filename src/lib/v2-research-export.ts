/** Export only fictional, non-evidence incident metadata for offline project evaluation. */
export type ExportIncident={id:string;title:string;category:string;status:string;createdAt:Date;updatedAt:Date;reports:{reportId:string}[]};
export type ExportReport={id:string;category:string;reviewState:string;createdAt:Date;incidentLink:{incidentId:string}|null};
export function csvCell(value:string|number){
 const text=String(value);
 // Spreadsheet applications can interpret user-authored strings as formulas.
 const safe=/^[\s]*[=+\-@]/.test(text)?"'"+text:text;
 return '"'+safe.replaceAll('"','""')+'"';
}
export function csvRow(cells:readonly (string|number)[]){return cells.map(csvCell).join(",");}
export function generateDemoResearchCsv(incidents:readonly ExportIncident[],reports:readonly ExportReport[]){
 const sortedIncidents=[...incidents].sort((a,b)=>a.id.localeCompare(b.id));
 const sortedReports=[...reports].sort((a,b)=>a.id.localeCompare(b.id));
 const lines=[
  csvRow(["record_type","record_id","category","state","created_at_utc","updated_at_utc","related_incident_id","linked_report_count","title"]),
  ...sortedIncidents.map(i=>csvRow(["incident",i.id,i.category,i.status,i.createdAt.toISOString(),i.updatedAt.toISOString(),"",i.reports.length,i.title])),
  ...sortedReports.map(r=>csvRow(["report",r.id,r.category,r.reviewState,r.createdAt.toISOString(),"",r.incidentLink?.incidentId||"",0,""]))
 ];
 return "\uFEFF"+lines.join("\r\n")+"\r\n";
}
