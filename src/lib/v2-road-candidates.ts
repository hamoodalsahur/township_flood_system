import type {RoadFeature} from "./bbr-roads";
/** Approximate metric point-to-segment distance for candidate visual inspection only. */
export function segmentDistanceMetres(point:readonly [number,number],a:readonly [number,number],b:readonly [number,number]):number{
 const midLat=point[1]*Math.PI/180;
 const xScale=111320*Math.cos(midLat),yScale=110540;
 const ax=(a[0]-point[0])*xScale,ay=(a[1]-point[1])*yScale;
 const bx=(b[0]-point[0])*xScale,by=(b[1]-point[1])*yScale;
 const dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy;
 const t=den===0?0:Math.max(0,Math.min(1,-(ax*dx+ay*dy)/den));
 return Math.hypot(ax+t*dx,ay+t*dy);
}
export type RoadCandidate={id:string;name:string;highway:string;sourceUrl:string;distanceMetres:number;verification:"osm_unverified"};
export function candidateRoads(point:readonly [number,number],roads:readonly RoadFeature[],maxMetres=150,limit=5):RoadCandidate[]{
 if(!Number.isFinite(point[0])||!Number.isFinite(point[1])||Math.abs(point[0])>180||Math.abs(point[1])>90)return [];
 return roads.flatMap(road=>{
  const coordinates=road.geometry.coordinates;
  let distance=Infinity;
  for(let i=1;i<coordinates.length;i++)distance=Math.min(distance,segmentDistanceMetres(point,coordinates[i-1],coordinates[i]));
  return distance<=maxMetres?[{id:road.properties.id,name:road.properties.name||"Unnamed OSM road",highway:road.properties.highway,
   sourceUrl:road.properties.sourceUrl,distanceMetres:Math.round(distance),verification:road.properties.verification}]:[];
 }).sort((a,b)=>a.distanceMetres-b.distanceMetres||a.id.localeCompare(b.id)).slice(0,limit);
}
