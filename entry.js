import fs from "fs";

import { tokenize } from "./tokeniser.js";
import { parse } from "./parser.js";

const source = fs.readFileSync("page.rvn", "utf-8");

const tokens = tokenize(source);
const ast = parse(tokens);

console.log("Tokens:");
console.log(tokens);

console.log("\nAST:");
console.log(ast);