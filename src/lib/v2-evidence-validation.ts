/** Demo image policy: sanitized image data is private to management and size-limited. */
export const MAX_EVIDENCE_BYTES = 200_000;
export const ALLOWED_EVIDENCE_TYPES = ["image/jpeg", "image/png"] as const;
export function validateDemoImage(payload: unknown): {mimeType: string; base64Data: string; bytes: number} {
  if (!payload || typeof payload !== "object") throw new Error("Invalid photo evidence");
  const data = payload as Record<string,unknown>;
  if(typeof data.mimeType !== "string" || !ALLOWED_EVIDENCE_TYPES.includes(data.mimeType as typeof ALLOWED_EVIDENCE_TYPES[number]))
    throw new Error("Choose a JPEG or PNG image");
  if(typeof data.base64Data !== "string" || data.base64Data.length === 0 || data.base64Data.length > Math.ceil(MAX_EVIDENCE_BYTES*4/3)+8 || !/^[A-Za-z0-9+/]*={0,2}$/.test(data.base64Data))
    throw new Error("Photo must be a small, valid base64 image");
  const bytes=Buffer.from(data.base64Data,"base64");
  if(bytes.length===0 || bytes.length>MAX_EVIDENCE_BYTES || bytes.toString("base64")!==data.base64Data)
    throw new Error("Photo exceeds demo size limit or is not properly encoded");
  const jpeg=bytes.length>3 && bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff;
  const png=bytes.length>8 && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if(data.mimeType==="image/jpeg"&&!jpeg || data.mimeType==="image/png"&&!png) throw new Error("Image bytes do not match its declared type");
  return {mimeType:data.mimeType,base64Data:data.base64Data,bytes:bytes.length};
}
