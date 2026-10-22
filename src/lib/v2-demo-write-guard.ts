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

/** Body-byte limit, even if Content-Length is absent or inaccurate.
 * Requests exceeding this local-demo limit never reach JSON parsing or the database.
 */
export class DemoBodyTooLargeError extends Error {
  constructor() { super("Demo JSON payload exceeds the allowed size"); this.name="DemoBodyTooLargeError"; }
}

export async function readBoundedDemoJson(request:Request, limitBytes:number):Promise<unknown>{
  if(!Number.isSafeInteger(limitBytes)||limitBytes<=0)throw new RangeError("Invalid demo body limit");
  if(!checkDemoJsonSize(request,limitBytes))throw new DemoBodyTooLargeError();
  const reader=request.body?.getReader();
  if(!reader)throw new SyntaxError("Unexpected end of JSON input");
  const decoder=new TextDecoder();
  let bytes=0;
  let body="";
  try {
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      bytes+=value.byteLength;
      if(bytes>limitBytes){
        await reader.cancel();
        throw new DemoBodyTooLargeError();
      }
      body+=decoder.decode(value,{stream:true});
    }
    body+=decoder.decode();
    return JSON.parse(body) as unknown;
  } finally {
    reader.releaseLock();
  }
}
