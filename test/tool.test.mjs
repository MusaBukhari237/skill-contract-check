import test from "node:test";
import assert from "node:assert/strict";
import * as core from "../docs/tool.mjs";

test("validates names, limits, block descriptions and required frontmatter", () => {
  assert.deepEqual(core.checkSkill("---\nname: useful-guide\ndescription: >\n  Help format notes.\n---","useful-guide"),[]);
  assert.equal(core.checkSkill("---\nname: BAD\ndescription: \n---","different").length,3);
  assert.match(core.checkSkill("Plain document")[0],/frontmatter/);
  assert.match(core.checkSkill("---\nname: doc\nname: example\ndescription: Here\n---")[0],/Duplicate/);
});
