export type ReadinessCheck={id:string;label:string;passed:boolean;detail:string};
export function inspectDemoReadiness(input:{environment:string|undefined;databaseUrl:string|undefined;operatorKey:string|undefined;provider:string|undefined;embedModel:string|undefined;roadFilePresent:boolean;roadFeatures:number|null;databaseAccessible:boolean}):ReadinessCheck[]{
 const dev=input.environment==="development";
 const localDb=Boolean(input.databaseUrl?.startsWith("file:"));
 return [
  {id:"local_mode",label:"Local development runtime",passed:dev,detail:dev?"Development mode enabled":"Only local development mode supports operator actions"},
  {id:"database",label:"SQLite database available",passed:localDb&&input.databaseAccessible,detail:localDb&&input.databaseAccessible?"Local SQLite is reachable":"Confirm DATABASE_URL and run npm run db:push"},
  {id:"operator_key",label:"Demo operator key configured",passed:Boolean(input.operatorKey&&input.operatorKey.length>=12&&input.operatorKey!=="replace-with-private-dev-key"),detail:"Checks configuration only; no credentials are returned"},
  {id:"road_file",label:"OSM reference data file available",passed:input.roadFilePresent,detail:input.roadFilePresent?`${input.roadFeatures??0} local unverified road lines; not road safety validation`:"Local road file missing or invalid"},
  {id:"embedding",label:"Embedding provider configured",passed:input.provider==="ollama"&&Boolean(input.embedModel),detail:input.provider==="ollama"?"Ollama configured; live model availability not verified":"Use local Ollama for optional AI matching"}
 ];
}
