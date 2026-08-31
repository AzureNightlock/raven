import fs from "fs";
import path from "path";
import { tokenise } from "./tokeniser/tokenise.js";
import { parse } from "./parser/main.js";
import { generate } from "./generator/generator.js";
import { generateJavaScript } from "./generator/js/generate.js";
import { reportAndExit } from "./errors.js";
import { GLYPH, green, red, bold, dim } from "./style.js";
import { getFileSizes, printStage } from "./cli/utils.js";

const cwd = process.cwd();
const file = process.argv[3] ?? "src/page.rvn";

const TOTAL = 4;
let stage = 0;

function formatSize(bytes) {
  return `${(bytes / 1000).toFixed(2)} kB`;
}

const started = performance.now();
const source = fs.readFileSync(path.join(cwd, file), "utf-8");

function runStage(message, fn) {
  return printStage(message, fn, ++stage, TOTAL);
}

try {
  const tokens = runStage("Tokenizing source", () => tokenise(source));
  const ast = runStage("Building AST", () => parse(tokens));
  const javascript = runStage("Generating JavaScript", () =>
    generateJavaScript(ast),
  );
  const filePaths = runStage("Generating Files", () => generate(javascript));
  const fileSizesObject = getFileSizes(filePaths);

  for (const { file, size } of fileSizesObject) {
    const icon = size != null ? green("✓") : red("✕");
    const label = size != null ? formatSize(size) : "missing";
    console.log(`${icon} ${file} ${dim(label)}`);
  }

} catch (error) {
  reportAndExit(error, source, file);
}

const elapsed = Math.round(performance.now() - started);

console.log(
  `${green(GLYPH.ok)} ${bold("Compilation successful")} ${dim(`in ${elapsed}ms`)}`,
);
