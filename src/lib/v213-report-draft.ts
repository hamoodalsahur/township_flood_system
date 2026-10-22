/** Client-facing hints mirror existing local-demo server constraints.
 * The backend remains authoritative; these hints never grant upload permissions.
 */
export type DemoDraftPhoto={type:string;size:number};
export type DemoDraftHints={
 locationError:string|null;
 descriptionError:string|null;
 photoError:string|null;
 canSubmit:boolean;
};
export function inspectDemoReportDraft(
 description:string,
 location:readonly [number,number]|null,
 photo:DemoDraftPhoto|null
):DemoDraftHints{
 const size=description.trim().length;
 const descriptionError=size<8?"Add at least 8 characters to describe this fictional issue.":
  description.length>400?"Keep the fictional description within 400 characters.":null;
 const locationError=location===null?"Choose a fictional report location by clicking the map below.":
  !Number.isFinite(location[0])||!Number.isFinite(location[1])||
  location[0]<101.40||location[0]>101.47||location[1]<3.06||location[1]>3.11
  ?"Choose a point inside the illustration's demonstration area.":null;
 const photoError=!photo?null:
  !["image/jpeg","image/png"].includes(photo.type)?"Choose a JPEG or PNG sample image.":
  photo.size<=0||photo.size>5_000_000?"The sample photo must be larger than 0 bytes and at most 5 MB.":null;
 return {locationError,descriptionError,photoError,
  canSubmit:descriptionError===null&&locationError===null&&photoError===null};
}
