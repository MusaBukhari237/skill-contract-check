import {readFile} from "node:fs/promises";
import {checkSkill} from "./docs/tool.mjs";
const [file, folder] = process.argv.slice(2);
if (!file) {
  console.error("Usage: node check.mjs path/to/SKILL.md [expected-folder]");
  process.exitCode = 2;
} else {
  try {
    const errors = checkSkill(await readFile(file, "utf8"), folder);
    console.log(errors.length ? errors.join("\n") : "Basic frontmatter checks passed.");
    process.exitCode = errors.length ? 1 : 0;
  } catch {
    console.error("Could not read the input file.");
    process.exitCode = 2;
  }
}
