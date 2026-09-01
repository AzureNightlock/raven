export function spacer(spaceSize = 3) {
  return " ".repeat(spaceSize);
}

export function formatErrorLine(lineNumber, line) {
  return spacer() + `${lineNumber}| ${line[lineNumber - 1].trim()}`;
}