import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { tokenize } from "./tokeniser.js";
import { parse } from "./parser/parserMain.js";
import { generate } from "./generator/generator.js";
import { reportAndExit } from "./errors.js";
import { GLYPH, deepPurple, red, green, bold, dim } from "../style.js";
import { printStage } from "./cli/cliUtils.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const file = process.argv[3] ?? "src/page.rvn";
const outputDir = path.join(cwd, "output");

const TOTAL = 4;
let stage = 0;
let writtenFiles = [];

function formatSize(bytes) {
  return `${(bytes / 1000).toFixed(2)} kB`;
}

const started = performance.now();
const source = fs.readFileSync(path.join(cwd, file), "utf-8");

function runStage(message, fn) {
  return printStage(message, fn, ++stage, TOTAL);
}

try {
  const tokens = runStage("Tokenizing source", () => tokenize(source));
  const ast = runStage("Building AST", () => parse(tokens));
  const output = runStage("Generating JavaScript", () => generate(ast));

  writtenFiles = runStage("Writing output", () => {
    fs.mkdirSync(outputDir, { recursive: true });

    return Object.entries(output).map(([name, contents]) => {
      const target = path.join(outputDir, name);

      fs.writeFileSync(target, contents);

      return target;
    });
  });
} catch (error) {
  reportAndExit(error, source, file);
}

const elapsed = Math.round(performance.now() - started);

console.log(`${green(GLYPH.ok)} ${bold("Compilation successful")}`);

const nameWidth = Math.max(
  ...written.map((target) => path.relative(root, target).length),
  0,
);

for (const target of written) {
  const relative = path.relative(process.cwd(), target).replace(/\\/g, "/");
  const size = formatSize(fs.statSync(target).size);
  console.log(`  ${deepPurple(relative.padEnd(nameWidth + 2))}${dim(size)}`);
}

console.log(`${green(GLYPH.ok)} compiled in ${bold(`${elapsed}ms`)}`);
