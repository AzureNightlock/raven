import fs from "fs";
import path from "path";
import { tokenise } from "../../../tokeniser/tokenise.js";
import { parse } from "../../../parser/main.js";
import { generateFiles } from "../../../generator/utils/generateFiles.js";
import { generateJavaScript } from "../../../generator/generate.js";
import { RavenError, reportAndExit } from "../../../errors/errors.js";
import { green, aka, bold, dim } from "../../utils/style.js";
import { getFileSizes, printStage } from "../../../cli/utils/utils.js";
import { buildSymbolTable } from "../../../symbolTable/structure.js";

const cwd = process.cwd();
const file = "src/page.rvn";

const TOTAL = 5;

function formatSize(bytes) {
  return `${(bytes / 1000).toFixed(2)} kB`;
}

export function compile({ logs = true }) {
  let stage = 0;
  const started = performance.now();

  const source = fs
    .readFileSync(path.join(cwd, file), "utf-8")
    .replace(/\r\n?/g, "\n");

  function runStage(message, fn) {
    if (!logs) {
      return fn();
    }

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

    const symbolTable = runStage("Building Symbol Table", () => buildSymbolTable(ast));

    const javascript = runStage("Generating JavaScript", () =>
      generateJavaScript(symbolTable),
    );

    const filePaths = runStage("Generating Files", () =>
      generateFiles(javascript),
    );

    if (logs) {
      console.log();
      const fileSizesObject = getFileSizes(filePaths);

      for (const { file, size } of fileSizesObject) {
        const icon = size != null ? green("✓") : aka("✕");
        const label = size != null ? formatSize(size) : "missing";

        console.log(`${icon} ${file} ${dim(label)}`);
      }

      const elapsed = Math.round(performance.now() - started);

      console.log(
        `${green("✓")} ${bold("Compilation successful")} ${dim(`in ${elapsed}ms`)}`,
      );
    }

    return filePaths;
  } catch (error) {
    console.log(error)
    reportAndExit(error, source, file);
  }
}
