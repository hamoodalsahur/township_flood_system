import type {RoadCollection} from "./bbr-roads";

/** File fingerprint is for local demo reproducibility, not OSM authenticity. */
export type GeoSourceManifest={
 sha256:string;
 sourceBytes:number;
 roadLines:number;
 uniqueWayIds:number;
 duplicateWayIds:number;
 coordinateVertices:number;
 namedWayLines:number;
 waysWithOsmNodeIds:number;
 waysMissingOsmNodeIds:number;
 waysWithOnewayTag:number;
 waysWithAccessOrVehicleTag:number;
 waysWithBridgeOrTunnelTag:number;
 disclaimer:string;
};

const present=(value:string|undefined)=>typeof value==="string"&&value.trim().length>0;
export function summarizeLocalGeoSource(roads:RoadCollection,sha256:string,sourceBytes:number):GeoSourceManifest{
 if(!/^[0-9a-f]{64}$/.test(sha256)||!Number.isSafeInteger(sourceBytes)||sourceBytes<0)
  throw new Error("Invalid local source fingerprint metadata");
 const unique=new Set(roads.features.map(f=>f.properties.id));
 const presentNodes=(f:RoadCollection["features"][number])=>Array.isArray(f.properties.osmNodeIds)&&
   f.properties.osmNodeIds.length===f.geometry.coordinates.length;
 const withNodes=roads.features.filter(presentNodes).length;
 return {
  sha256,sourceBytes,roadLines:roads.features.length,uniqueWayIds:unique.size,
  duplicateWayIds:roads.features.length-unique.size,
  coordinateVertices:roads.features.reduce((sum,f)=>sum+f.geometry.coordinates.length,0),
  namedWayLines:roads.features.filter(f=>present(f.properties.name)).length,
  waysWithOsmNodeIds:withNodes,
  waysMissingOsmNodeIds:roads.features.length-withNodes,
  waysWithOnewayTag:roads.features.filter(f=>present(f.properties.oneway)).length,
  waysWithAccessOrVehicleTag:roads.features.filter(f=>present(f.properties.access)||present(f.properties.motor_vehicle)).length,
  waysWithBridgeOrTunnelTag:roads.features.filter(f=>present(f.properties.bridge)||present(f.properties.tunnel)).length,
  disclaimer:"SHA-256 identifies the exact bytes of this local demonstration GeoJSON copy; it does not prove OSM origin, licensing compliance, road identity, completeness, freshness, access, safety or live incident conditions. Different formatting can change the hash."
 };
}
