// node scripts/thumbnail-source.test.mjs
import assert from "node:assert/strict";
import {
  enabledForCategory,
  parseCategoryIds,
  pickThumbnail,
} from "../javascripts/discourse/lib/thumbnail-source.js";

const full = [
  { max_width: null, url: "orig.png", width: 1600, height: 1200 },
  { max_width: 800, url: "a800.png", width: 800, height: 600 },
  { max_width: 400, url: "a400.png", width: 400, height: 300 },
];

// --- pickThumbnail ---

// no thumbnails -> render nothing (placeholder path)
assert.equal(pickThumbnail(null), null);
assert.equal(pickThumbnail([]), null);
assert.equal(pickThumbnail(undefined), null);

// generated sizes in a srcset, smallest first, with the original as the largest
const picked = pickThumbnail(full);
assert.equal(picked.src, "orig.png");
assert.equal(picked.srcset, "a400.png 400w, a800.png 800w, orig.png 1600w");
assert.equal(picked.width, 1600);
assert.equal(picked.height, 1200);

// resizes not generated yet -> the original alone, no srcset
assert.equal(pickThumbnail([full[0]]).srcset, null);
assert.equal(
  pickThumbnail([full[0], { max_width: 400, url: null, width: 400 }]).srcset,
  null
);

// a small upload whose resize has the same width -> one candidate, no srcset
assert.equal(
  pickThumbnail([
    { url: "small.png", width: 300, height: 200 },
    { max_width: 400, url: "small-copy.png", width: 300, height: 200 },
  ]).srcset,
  null
);

// original with no url yet -> nothing rather than a broken image
assert.equal(pickThumbnail([{ max_width: null, url: null }]), null);

// --- parseCategoryIds ---

assert.deepEqual(parseCategoryIds(""), []);
assert.deepEqual(parseCategoryIds(undefined), []);
assert.deepEqual(parseCategoryIds("4"), [4]);
assert.deepEqual(parseCategoryIds("4|17|23"), [4, 17, 23]);

// --- enabledForCategory ---

// empty allow-list: every list, including /latest (no category)
assert.equal(enabledForCategory(4, []), true);
assert.equal(enabledForCategory(undefined, []), true);

// non-empty allow-list: only the listed categories
assert.equal(enabledForCategory(4, [4, 17]), true);
assert.equal(enabledForCategory(9, [4, 17]), false);

// /latest and /top have no category, so they are excluded once scoped
assert.equal(enabledForCategory(undefined, [4, 17]), false);

// a subcategory is not covered by its parent being listed
assert.equal(enabledForCategory(31, [4]), false);

console.log("ok - thumbnail-source");
