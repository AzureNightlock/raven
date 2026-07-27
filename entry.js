import fs from "fs";

import { tokenize } from "./tokeniser.js";
import { parse } from "./parser.js";
import { generate } from "./generator.js";

const source = fs.readFileSync("page.rvn", "utf-8");

const tokens = tokenize(source);
console.log(tokens);
const ast = parse(tokens);

generate(ast);

console.log("\nAST:");
console.log(JSON.stringify(ast, null, 2));
console.log("Generated output/index.html and output/script.js");
