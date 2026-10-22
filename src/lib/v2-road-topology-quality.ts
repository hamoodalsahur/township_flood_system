import type {RoadCollection} from "./bbr-roads";
/** OSM source topology diagnostics, not a routing or accessibility model. */
export type NetworkQuality={roadLines:number;waysWithNodes:number;waysMissingNodes:number;totalSegments:number;zeroLengthSegments:number;repeatedNodePairs:number;duplicateWayIds:number;coordinateConflicts:number;isolatedWays:number;largestComponentWays:number;componentCount:number;disclaimer:string};
export function analyseRoadTopologyQuality(roads:RoadCollection):NetworkQuality{
 const parents=roads.features.map((_,i)=>i);
 const root=(i:number):number=>{while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i];}return i;};
 const union=(a:number,b:number)=>{const r=root(a),s=root(b);if(r!==s)parents[s]=r;};
 const owners=new Map<number,number>();
 const coordinates=new Map<number,string>();
 const ids=new Set<string>();
 let zero=0,repeated=0,duplicate=0,conflicts=0,segments=0,hasNodes=0;
 roads.features.forEach((road,i)=>{
  if(ids.has(road.properties.id))duplicate++;ids.add(road.properties.id);
  const coords=road.geometry.coordinates;
  segments+=coords.length-1;
  for(let j=1;j<coords.length;j++)if(coords[j][0]===coords[j-1][0]&&coords[j][1]===coords[j-1][1])zero++;
  const nodes=road.properties.osmNodeIds;
  if(!nodes)return;
  hasNodes++;
  nodes.forEach((node,j)=>{
   if(j>0&&nodes[j-1]===node)repeated++;
   const key=coords[j][0].toFixed(6)+","+coords[j][1].toFixed(6);
   const earlier=coordinates.get(node);
   if(earlier!==undefined&&earlier!==key)conflicts++;
   if(earlier===undefined)coordinates.set(node,key);
   const owner=owners.get(node);
   if(owner===undefined)owners.set(node,i);else union(i,owner);
  });
 });
 const sizes=new Map<number,number>();
 roads.features.forEach((road,i)=>{if(!road.properties.osmNodeIds)return;const r=root(i);sizes.set(r,(sizes.get(r)||0)+1);});
 return {roadLines:roads.features.length,waysWithNodes:hasNodes,waysMissingNodes:roads.features.length-hasNodes,totalSegments:segments,zeroLengthSegments:zero,repeatedNodePairs:repeated,duplicateWayIds:duplicate,coordinateConflicts:conflicts,
 isolatedWays:[...sizes.values()].filter(n=>n===1).length,largestComponentWays:Math.max(0,...sizes.values()),componentCount:sizes.size,
 disclaimer:"OSM node sharing and geometry consistency are quality indicators only. Connected way groups do not establish legal access, safe turns, road availability or travel routes."};
}
