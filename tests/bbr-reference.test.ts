import assert from "node:assert/strict";
import { test } from "node:test";
import { bbrReferencePoints, isValidLonLat } from "../src/lib/bbr-reference";

test("BBR geographic reference points have valid sourced GeoJSON coordinates", () => {
  assert.equal(bbrReferencePoints.type, "FeatureCollection");
  assert.ok(bbrReferencePoints.features.length > 0);
  for (const feature of bbrReferencePoints.features) {
    assert.equal(feature.geometry.type, "Point");
    assert.equal(isValidLonLat(feature.geometry.coordinates), true);
    assert.match(feature.properties.sourceUrl, /^https:\/\/www\.openstreetmap\.org\/node\/\d+$/);
    assert.equal(feature.properties.verification, "source_mapped");
  }
});
test("coordinate guard rejects swapped or implausible ranges", () => {
  assert.equal(isValidLonLat([101.4377, 3.0852]), true);
  assert.equal(isValidLonLat([181, 3]), false);
  assert.equal(isValidLonLat([101, 91]), false);
  assert.equal(isValidLonLat([NaN, 3]), false);
});
