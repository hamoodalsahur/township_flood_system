import type {PrivatePhotoState} from "./v214-evidence-state";
/** UI-only policy. The existing server endpoint independently enforces publication. */
export type ReviewPhotoPresentation="approved_inline"|"inspect_private"|"none"|"unavailable";
export function reviewPhotoPresentation(
 state:PrivatePhotoState|null|undefined,
 reviewState:string
):ReviewPhotoPresentation{
 if(state==null||state==="unknown")return "unavailable";
 if(state==="approved_public_demo"){
   // Only corroborated fictional reports can have server-authorized public photos.
   return reviewState==="corroborated"?"approved_inline":"unavailable";
 }
 if(state==="private_unreviewed"||state==="private_rejected")return "inspect_private";
 return "none";
}
