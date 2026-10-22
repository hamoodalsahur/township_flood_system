/** Metadata-only descriptive summary of fictional demo actions.
 * No actor, subject, private reasons or evidence contents are included.
 */
export type DemoAuditMetadata={action:string;createdAt:Date};
export type DemoAuditSummary={
  totalActions:number;
  last24Hours:number;
  last7Days:number;
  incidentManagementActions:number;
  geographicReviewActions:number;
  scenarioOrRoadDemoActions:number;
  otherDemoActions:number;
  invalidOrFutureTimestamps:number;
  disclaimer:string;
};

export function summarizeDemoAudit(rows:readonly DemoAuditMetadata[],now=new Date()):DemoAuditSummary{
 const counts:DemoAuditSummary={
  totalActions:rows.length,last24Hours:0,last7Days:0,
  incidentManagementActions:0,geographicReviewActions:0,
  scenarioOrRoadDemoActions:0,otherDemoActions:0,invalidOrFutureTimestamps:0,
  disclaimer:"Aggregate fictional local audit metadata only. Counts depend on the demo server clock and database coverage; they are not proof of complete logging, identity, evidence handling, road safety or real-world operator compliance."
 };
 const current=now.getTime();
 for(const row of rows){
  if(row.action.startsWith("v2_demo_incident_"))counts.incidentManagementActions++;
  else if(row.action.startsWith("v2_demo_hazard_"))counts.geographicReviewActions++;
  else if(row.action.startsWith("scenario_")||row.action.startsWith("road_")||row.action.startsWith("demo_"))counts.scenarioOrRoadDemoActions++;
  else counts.otherDemoActions++;
  const time=row.createdAt.getTime();
  const age=current-time;
  if(!Number.isFinite(age)||age<0){counts.invalidOrFutureTimestamps++;continue;}
  if(age<=7*24*3600000)counts.last7Days++;
  if(age<=24*3600000)counts.last24Hours++;
 }
 return counts;
}
