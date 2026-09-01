export function spacer(spaceSize = 3) {
  return " ".repeat(spaceSize);
}

export function formatErrorLine(lineNumber, lines) {
  return spacer() + `${lineNumber}| ${lines[lineNumber - 1].trim()}`;
}