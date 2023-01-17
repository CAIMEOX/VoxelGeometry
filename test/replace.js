import * as fs from "fs";

// Replace
let dirs = fs.readdirSync("../build/behavior_packs/gen/scripts/src");

dirs.forEach((f) => {
  try {
    let content = fs.readFileSync("../build/behavior_packs/gen/scripts/src/" + f);
    let c = content
      .toString()
      .split("\n")
      .filter((val) => !val.startsWith("import") && !val.endsWith('"@minecraft/server";'));
    c.unshift(`class BlockLocation {
        constructor(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
      }`);
    c = c.join("\n");
    fs.writeFileSync(f, c);
    console.log("writring: ", f, { flag: "a+" });
  } catch (e) {
    console.log(e);
  }
});
