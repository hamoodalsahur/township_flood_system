import {test} from "node:test";
import assert from "node:assert/strict";
import {AI_REVIEW_REMINDER,similarityLabel,canManuallyLinkSuggestion} from "../src/lib/v214-ai-review-guidance";
test("similarity is explicitly not expressed as confidence or real-hazard probability",()=>{
 assert.equal(similarityLabel(0.784),"78.4% text similarity · not a verified match");
 assert.match(similarityLabel(NaN),/unavailable/);
 assert.match(similarityLabel(2),/unavailable/);
 assert.match(AI_REVIEW_REMINDER,/not a probability/);
 assert.match(AI_REVIEW_REMINDER,/explicitly link/);
});
test("manual link hint requires currently available candidate and independent reason",()=>{
 assert.equal(canManuallyLinkSuggestion("a",["a","b"],"A fictional corroborating observation"),true);
 assert.equal(canManuallyLinkSuggestion("c",["a","b"],"A fictional corroborating observation"),false);
 assert.equal(canManuallyLinkSuggestion("a",["a"],"short"),false);
 assert.equal(canManuallyLinkSuggestion("a",["a"],"x".repeat(401)),false);
});
