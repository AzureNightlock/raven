import fs from "fs";

import { tokenize } from "./tokeniser.js";
import { parse } from "./parser.js";
import { generate } from "./generator.js";
import { reportAndExit } from "./errors.js";

const file = "page.rvn";
const source = fs.readFileSync(file, "utf-8");

try {
  const tokens = tokenize(source);
  const ast = parse(tokens);
  generate(ast);
} catch (error) {
  reportAndExit(error, source, file);
}

console.log("Generated output/index.html and output/script.js");