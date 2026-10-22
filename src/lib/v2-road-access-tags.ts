import type {RoadCollection} from "./bbr-roads";

/** Read-only observations of unverified OSM tags, NEVER road permissions or a routable graph. */
export type RoadTagAudit={
  roadLines:number;
  explicitlyOneWay:number;
  reverseOneWay:number;
  unrecognisedOneway:number;
  nonstandardAccess:number;
  nonstandardMotorVehicle:number;
  missingAccessAndMotorVehicle:number;
  bridgeTagged:number;
  tunnelTagged:number;
  nonzeroLayer:number;
  invalidLayerTag:number;
  disclaimer:string;
};

const normalized=(value:string|undefined)=>value?.trim().toLowerCase()??"";
const present=(value:string)=>value.length>0;
const affirmative=(value:string)=>value==="yes"||value==="1"||value==="true";
const negative=(value:string)=>value==="no"||value==="0"||value==="false";

export function analyseRoadAccessTags(roads:RoadCollection):RoadTagAudit{
  const result:RoadTagAudit={
    roadLines:roads.features.length,explicitlyOneWay:0,reverseOneWay:0,
    unrecognisedOneway:0,nonstandardAccess:0,nonstandardMotorVehicle:0,
    missingAccessAndMotorVehicle:0,bridgeTagged:0,tunnelTagged:0,
    nonzeroLayer:0,invalidLayerTag:0,
    disclaimer:"Unverified OSM tags indicate only data requiring independent review. Missing tags are unknown, not proof of access. Oneway, bridge, tunnel and layer tags alone cannot establish navigability, legal turns, crossings, safe routes or current road conditions."
  };
  for(const road of roads.features){
    const p=road.properties;
    const one=normalized(p.oneway),access=normalized(p.access),vehicle=normalized(p.motor_vehicle);
    const bridge=normalized(p.bridge),tunnel=normalized(p.tunnel),layer=normalized(p.layer);
    if(affirmative(one)||one==="-1")result.explicitlyOneWay++;
    if(one==="-1")result.reverseOneWay++;
    if(present(one)&&!affirmative(one)&&!negative(one)&&one!=="-1")result.unrecognisedOneway++;
    if(present(access)&&!affirmative(access))result.nonstandardAccess++;
    if(present(vehicle)&&!affirmative(vehicle))result.nonstandardMotorVehicle++;
    if(!present(access)&&!present(vehicle))result.missingAccessAndMotorVehicle++;
    if(present(bridge)&&!negative(bridge))result.bridgeTagged++;
    if(present(tunnel)&&!negative(tunnel))result.tunnelTagged++;
    if(present(layer)){
      const number=Number(layer);
      if(!Number.isFinite(number))result.invalidLayerTag++;
      else if(number!==0)result.nonzeroLayer++;
    }
  }
  return result;
}
