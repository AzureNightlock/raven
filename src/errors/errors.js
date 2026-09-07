import * as colors from "../cli/style.js";
import { spacer, formatErrorLine } from "./utils.js";

let errorNumber = 1; //change this when multiple errors get found at once gets implemented

export class RavenError extends Error {
  constructor(errorType, message, token, hint) {
    super(message);
    this.errorType = errorType;
    this.name = "RavenError";
    this.token = token;
    this.hint = hint;
  }
}

function getContextLine(startLine, fileLines) {
  let contextCounter = startLine - 2;

  while (
    contextCounter >= 0 &&
    !fileLines[contextCounter]?.trimEnd().endsWith("{")
  ) {
    contextCounter--;
  }

  if (contextCounter < 0) return null;

  return contextCounter + 1;
}

export function renderError(error, fileContent, file = "<anonymous>") {
  const { type, line, columnStart, columnEnd, length } = error.token;
  const isEOF = type === "EOF";
  const displayLength = isEOF ? "<EOF>".length : length;
  let output = [];
  const fileLines = fileContent.split("\n");
  const errorMessage =
    `${spacer(1) + colors.deepPurple(error.errorType)}` +
    `${colors.dim(":")} ${error.message}\n`;

  const contextLine = getContextLine(line, fileLines);
  const width = 80;
  const plainHeader = `╔══[${errorNumber}]══[${file}:${line}:${columnStart}]`;
  const remaining = Math.max(0, width - plainHeader.length - 1);

  const header =
    colors.sumi("╔══[") +
    colors.purple(errorNumber) +
    colors.sumi("]══[") +
    `${colors.purple(file)}${colors.dim(":")}${colors.purple(line)}${colors.dim(":")}${colors.purple(columnStart)}` +
    colors.sumi("]") +
    colors.sumi("═".repeat(remaining));

  output.push(header);
  output.push(errorMessage);

  const errorLine = formatErrorLine(line, fileLines) + (isEOF ? colors.ai("<EOF>") : "");
  if (contextLine === null) {
    output.push(errorLine);
  } else if (contextLine + 1 === line) {
    output.push(formatErrorLine(contextLine, fileLines));
    output.push(errorLine);
  } else {
    output.push(formatErrorLine(contextLine, fileLines));
    output.push(spacer(5) + `${colors.deepPurple("|")} ${colors.ai("...")}`);
    output.push(errorLine);
  }

  const left = Math.floor((displayLength - 1) / 2);
  const right = displayLength - left - 1;

  const marker =  "─".repeat(left) + "┬" + "─".repeat(right);

  output.push(
    spacer(5) +
      colors.dim("·") +
      " ".repeat(columnStart) +
      colors.deepPurple(marker),
  );

  output.push(
    spacer(5) +
      colors.deepPurple(
        "|" + "─".repeat(columnStart + displayLength / 2) + "┘",
      ),
  );

  output.push("");

  if (error.hint) {
    output.push(
      spacer(2) +
        `${colors.purple("hint")}${colors.dim(":")} ${colors.ai(error.hint)}`,
    );
  }

  output.push(colors.sumi("╚" + "═".repeat(width - 1)));

  return output.join("\n");
}

export function reportAndExit(error, fileContent, file) {
  if (!(error instanceof RavenError)) {
    console.log("Not a raven error");
    throw error;
  }

  console.error("\n" + renderError(error, fileContent, file) + "\n");

  process.exit(1);
}
