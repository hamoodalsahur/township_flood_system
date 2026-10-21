/** Fictional incident markers near the BBR study window. NOT observed hazards. */
export const HAZARD_CATEGORIES = ["flooding","roadworks","fallen_tree","pothole","road_obstruction","storm_damage","other"] as const;
export type HazardCategory = (typeof HAZARD_CATEGORIES)[number];
export type DemoHazard = {
  id: string; category: HazardCategory; title: string; description: string;
  coordinates: [number, number]; impact: "caution" | "partial_obstruction" | "suspected_closure";
  reportedAt: string; status: "fictional_unverified"; sourceMode: "simulation";
};
export const CATEGORY_LABELS: Record<HazardCategory,string> = {
  flooding:"Flooding",roadworks:"Roadworks",fallen_tree:"Fallen tree",
  pothole:"Pothole",road_obstruction:"Blocked road",storm_damage:"Storm damage",other:"Other",
};
export const DEMO_HAZARDS: DemoHazard[] = [
  {id:"demo-flood-01",category:"flooding",title:"Surface water reported",description:"Fictional report: water accumulation near an example junction.",coordinates:[101.4318,3.0876],impact:"caution",reportedAt:"2026-10-21T09:00:00+08:00",status:"fictional_unverified",sourceMode:"simulation"},
  {id:"demo-tree-02",category:"fallen_tree",title:"Tree obstructing roadside",description:"Fictional report: fallen branches partially obstruct a demonstration road.",coordinates:[101.4392,3.0891],impact:"partial_obstruction",reportedAt:"2026-10-21T09:12:00+08:00",status:"fictional_unverified",sourceMode:"simulation"},
  {id:"demo-work-03",category:"roadworks",title:"Scheduled construction example",description:"Fictional maintenance scenario. Not an actual township notice.",coordinates:[101.4369,3.0808],impact:"suspected_closure",reportedAt:"2026-10-21T09:20:00+08:00",status:"fictional_unverified",sourceMode:"simulation"},
  {id:"demo-hole-04",category:"pothole",title:"Road surface damage",description:"Fictional report: pothole requires inspection.",coordinates:[101.4257,3.0833],impact:"caution",reportedAt:"2026-10-21T09:29:00+08:00",status:"fictional_unverified",sourceMode:"simulation"},
];
export function filterDemoHazards(category: HazardCategory | "all", hazards: readonly DemoHazard[]=DEMO_HAZARDS) {
  return hazards.filter(item => category === "all" || item.category === category);
}
