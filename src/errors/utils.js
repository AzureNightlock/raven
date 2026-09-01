import { deepPurple, dim, aka, neonCyan, yamabuki, ai, ink, sakura, green, purple } from "../cli/style.js";
import { tokenise } from "../tokeniser/tokenise.js";

// Keyed by the token types produced by tokenType() in src/tokeniser/utils.js.
// IDENTIFIER is deliberately absent: the missing lookup is what leaves it
// uncoloured, so unknown token types degrade the same way.
const TOKEN_COLOURS = {
  DATA_TYPE: aka,
  KEYWORD: deepPurple,
  EVENT: neonCyan,
  SYMBOL: deepPurple,
  ARITHMETIC_OPERATOR: deepPurple,
  COMPARISON_OPERATOR: deepPurple,
  LOGICAL_OPERATOR: deepPurple,
  COMPOUND_ASSIGNMENT_OPERATOR: deepPurple,
  STRING: yamabuki,
  NUMBER: yamabuki,
  EOF: ai,
};

export function spacer(spaceSize = 3) {
  return " ".repeat(spaceSize);
}

// Re-runs the real tokeniser over a single trimmed line so highlighting can
// never drift from the language definition. Columns come back relative to the
// string passed in, so they index straight into it.
function highlight(text) {
  let tokens;

  try {
    tokens = tokenise(text);
  } catch {
    return text; // never let rendering an error throw a second error
  }

  let output = "";
  let cursor = 0;

  for (const token of tokens) {
    const paint = TOKEN_COLOURS[token.type];

    if (!paint) continue; // IDENTIFIER, EOF, anything unrecognised

    const from = Math.max(cursor, token.columnStart - 1);
    const to = Math.min(text.length, token.columnEnd - 1);

    if (to <= from) continue;

    output += text.slice(cursor, from);
    output += paint(text.slice(from, to));
    cursor = to;
  }

  return output + text.slice(cursor);
}

export function formatErrorLine(lineNumber, lines) {
  const text = lines[lineNumber - 1]?.trim();
  const content = text ? highlight(text) : ai("<EOF>");

  return spacer() + `${dim(lineNumber)} ${deepPurple("|")} ${content}`;
}
