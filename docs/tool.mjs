export function checkSkill(input, folder = "") {
  const lines = input.replace(/^\uFEFF/, "").split(/\r?\n/);
  const end = lines.indexOf("---",1);
  if (lines[0] !== "---" || end < 2) return ["Add YAML frontmatter delimited by ---."];
  const fields = new Map(), errors = [];
  for (let i = 1; i < end; i++) {
    const match = /^([\w-]+):[ \t]*(.*)$/.exec(lines[i]);
    if (!match) continue;
    const [,key, raw] = match;
    if (!["name","description"].includes(key)) continue;
    if (fields.has(key)) errors.push("Duplicate field: " + key);
    const value = /^[|>][+-]?$/.test(raw) ? lines.slice(i+1,end).reduce((state,line) => {
      if (state.ended || (line && !/^\s/.test(line))) return {...state,ended:true};
      return {ended:false,text:state.text + " " + line.trim()};
    },{ended:false,text:""}).text.trim() : raw.trim().replace(/^(["'])(.*)\1$/,"$2");
    fields.set(key,value);
  }
  const name = fields.get("name") ?? "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) errors.push("Name must use lowercase ASCII letters, numbers and single hyphens (1–64 characters).");
  if (folder && name !== folder) errors.push("Name must match the folder.");
  const description = fields.get("description") ?? "";
  if (!description || description.length > 1024) errors.push("Description must be 1–1024 characters.");
  return errors;
}
