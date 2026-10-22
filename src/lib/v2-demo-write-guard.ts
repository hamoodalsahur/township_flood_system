/** Demo-only public write boundary: fail closed in production. Not authentication or abuse prevention. */
export function mayAcceptDemoSubmission(environment:string|undefined){
 return environment==="development";
}
export function checkDemoJsonSize(request:Pick<Request,"headers">,limitBytes:number) {
 const value=request.headers.get("content-length");
 if(value===null)return true;
 if(!/^\d+$/.test(value))return false;
 return Number(value)<=limitBytes;
}
