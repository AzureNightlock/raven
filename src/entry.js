import fs from "fs";
import path from "path";
import { tokenise } from "./tokeniser/tokenise.js";
import { parse } from "./parser/main.js";
import { generate } from "./generator/generator.js";
import { generateJavaScript } from "./generator/js/generate.js";
import { RavenError, reportAndExit } from "./errors/errors.js";
import { green, aka, bold, dim } from "./cli/style.js";
import { getFileSizes, printStage } from "./cli/utils.js";
import { buildSymbolTable } from "./symbolTable/structure.js";

const cwd = process.cwd();
const file = process.argv[3] ?? "src/page.rvn";

const TOTAL = 5;
let stage = 0;

function formatSize(bytes) {
  return `${(bytes / 1000).toFixed(2)} kB`;
}

const started = performance.now();
const source = fs
  .readFileSync(path.join(cwd, file), "utf-8")
  .replace(/\r\n?/g, "\n");

function runStage(message, fn) {
  return printStage(message, fn, ++stage, TOTAL);
}

try {
  const tokens = runStage("Tokenizing source", () => tokenise(source));
  if (tokens[0].type === "EOF") {
    throw new RavenError(
      "EmptyFileError",
      "Cannot compile an empty file",
      tokens[0],
      "Add some Raven code to the file.",
    );
  }
  const ast = runStage("Building AST", () => parse(tokens));
  const symbolTable = runStage("Building Symbol Table", () =>
    buildSymbolTable(ast),
  );
  const javascript = runStage("Generating JavaScript", () =>
    generateJavaScript(ast),
  );
  const filePaths = runStage("Generating Files", () => generate(javascript));
  const fileSizesObject = getFileSizes(filePaths);

  for (const { file, size } of fileSizesObject) {
    const icon = size != null ? green("✓") : aka("✕");
    const label = size != null ? formatSize(size) : "missing";
    console.log(`${icon} ${file} ${dim(label)}`);
  }
} catch (error) {
  reportAndExit(error, source, file);
}

const elapsed = Math.round(performance.now() - started);

console.log(
  `${green("✓")} ${bold("Compilation successful")} ${dim(`in ${elapsed}ms`)}`,
);
