/** Human-review guidance for optional fictional AI matches; no decisions or thresholds. */
export const AI_REVIEW_REMINDER="Similarity is not a probability that reports describe the same event. Read the reports, enter your own justification, then explicitly link only if appropriate. No road status is changed.";
export function similarityLabel(score:number):string{
 if(!Number.isFinite(score)||score<0||score>1)return "Similarity unavailable · manual review needed";
 return (score*100).toFixed(1)+"% text similarity · not a verified match";
}
export function canManuallyLinkSuggestion(
 suggestedId:string,
 availableIds:readonly string[],
 operatorReason:string
):boolean{
 return availableIds.includes(suggestedId)&&operatorReason.trim().length>=8&&operatorReason.length<=400;
}
