import { GLYPH, purple, red, bold, dim } from "../style.js";
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
  if (!error.token) return `  ${red(GLYPH.mark)} ${bold(error.message)}`;
  const { line, columnStart, columnEnd, length } = error.token;
  let output = [];
  const fileLines = fileContent.split("\n");
  const errorMessage = `${errorNumber}) ${error.errorType}: ${error.message}\n`;
  const contextLine = getContextLine(line, fileLines);

  output.push("─".repeat(80));
  output.push(`file: ${file}`);
  output.push(`${errorMessage}`);

  if (contextLine === null) {
    output.push(formatErrorLine(line, fileLines));
  } else if (contextLine + 1 === line) {
    output.push(formatErrorLine(contextLine, fileLines));
    output.push(formatErrorLine(line, fileLines));
  } else {
    output.push(formatErrorLine(contextLine, fileLines));
    output.push(spacer(4) + "| ...");
    output.push(formatErrorLine(line, fileLines));
  }
  output.push("\n")
  output.push(spacer(2)+`hint: ${error.hint}`)
  output.push("─".repeat(80));
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
