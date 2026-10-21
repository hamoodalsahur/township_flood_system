/** Compress and re-encode user-selected image before demo upload; removes source EXIF. */
export async function prepareDemoPhoto(file: File): Promise<{mimeType:"image/jpeg";base64Data:string}> {
  if(!["image/jpeg","image/png"].includes(file.type))throw Error("Choose a JPEG or PNG");
  if(file.size===0 || file.size>5_000_000)throw Error("Image must be 5 MB or smaller");
  const image=await createImageBitmap(file);
  try {
    const width=Math.max(1,Math.round(image.width*Math.min(1,640/image.width,640/image.height)));
    const height=Math.max(1,Math.round(image.height*Math.min(1,640/image.width,640/image.height)));
    const canvas=document.createElement("canvas"); canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext("2d");
    if(!ctx)throw Error("Image processing unavailable");
    ctx.fillStyle="#fff";ctx.fillRect(0,0,width,height);
    ctx.drawImage(image,0,0,width,height);
    const dataUrl=canvas.toDataURL("image/jpeg",0.65);
    const base64Data=dataUrl.split(",")[1];
    if(!base64Data||base64Data.length>260_000)throw Error("Compressed demo image remains too large");
    return {mimeType:"image/jpeg",base64Data};
  } finally {image.close();}
}
