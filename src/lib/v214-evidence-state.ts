/** Local-demo presentation labels only, not a photo verification or permission system. */
export type PrivatePhotoState="none"|"private_unreviewed"|"private_rejected"|"approved_public_demo"|"unknown";
export type PrivatePhotoBadge={label:string;explanation:string;canOfferApproval:boolean;publicDemo:boolean};
export function describePrivatePhotoState(state:PrivatePhotoState):PrivatePhotoBadge{
 switch(state){
  case "none":return {label:"No photo attached",explanation:"This fictional report has no recorded sample photo.",canOfferApproval:false,publicDemo:false};
  case "private_unreviewed":return {label:"Private · awaiting review",explanation:"A sample photo is stored privately. Publishing it separately requires deliberate human approval during report review.",canOfferApproval:true,publicDemo:false};
  case "private_rejected":return {label:"Kept private",explanation:"The sample photo is not approved for public demonstration. This state does not itself prove the report was rejected.",canOfferApproval:false,publicDemo:false};
  case "approved_public_demo":return {label:"Approved for public demo",explanation:"An operator explicitly approved this fictional sample for demonstration, not as verified road evidence.",canOfferApproval:false,publicDemo:true};
  default:return {label:"Photo state needs inspection",explanation:"Recorded evidence state is unexpected; inspect privately before making any publication decision.",canOfferApproval:false,publicDemo:false};
 }
}
export function photoStateFromRecord(state:string|null|undefined):PrivatePhotoState{
 if(state==null)return "none";
 if(state==="private_unreviewed"||state==="private_rejected"||state==="approved_public_demo")return state;
 return "unknown";
}
