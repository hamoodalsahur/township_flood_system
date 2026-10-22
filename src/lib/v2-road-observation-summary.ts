import type {RoadFeature} from "./bbr-roads";
import {segmentDistanceMetres} from "./v2-road-candidates";

/**
 * Descriptive distances to unverified line geometry, not confirmation,
 * independence of reports, accessibility, road impact or routing.
 */
export type RoadObservationSummary={
  eligibleReportLocations:number;
  nearbyReportLocations:number;
  approximateClosestMetres:number|null;
  approximateFarthestNearbyMetres:number|null;
  duplicateOsmWayId:boolean;
  disclaimer:string;
};
const validPoint=(p:readonly [number,number])=>
  Number.isFinite(p[0])&&Number.isFinite(p[1])&&Math.abs(p[0])<=180&&Math.abs(p[1])<=90;

export function summarizeRoadObservations(
  points:readonly (readonly [number,number])[],
  roads:readonly RoadFeature[],
  wayId:string,
  maxMetres=150
):RoadObservationSummary {
  if(!Number.isFinite(maxMetres)||maxMetres<=0||maxMetres>1000)throw new RangeError("Invalid research comparison radius");
  const eligible=points.filter(validPoint);
  const matches=roads.filter(road=>road.properties.id===wayId);
  const line=matches.length===1?matches[0]:null;
  const nearby:number[]=[];
  if(line)for(const point of eligible){
    const coordinates=line.geometry.coordinates;
    let distance=Infinity;
    for(let i=1;i<coordinates.length;i++){
      distance=Math.min(distance,segmentDistanceMetres(point,coordinates[i-1],coordinates[i]));
    }
    if(distance<=maxMetres)nearby.push(distance);
  }
  return {
    eligibleReportLocations:eligible.length,
    nearbyReportLocations:nearby.length,
    approximateClosestMetres:nearby.length?Math.round(Math.min(...nearby)):null,
    approximateFarthestNearbyMetres:nearby.length?Math.round(Math.max(...nearby)):null,
    duplicateOsmWayId:matches.length>1,
    disclaimer:"Nearby fictional report coordinates are descriptive observations only. Multiple observations may be duplicated, inaccurate or correlated. OSM geometry is unverified; no road association, accessibility, severity, closure or safety decision follows."
  };
}
