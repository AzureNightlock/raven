import { deepPurple, dim, aka, neonCyan, yamabuki, ai, ink, sakura, green, purple } from "../cli/style.js";
import { tokenise } from "../tokeniser/tokenise.js";

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

function paintText(token){
  const paint = TOKEN_COLOURS[token.type];
  if (!paint) {
    return token.value;
  }
  
  if (token.type === "EOF"){
    return paint("<EOF>")
  };

  return paint(token.value);
}

function highlight(text) {
  const tokens = tokenise(text);
  let output = ``;

  const firstToken = tokens[0];
  output += paintText(firstToken) + ` `;

  for (const token of tokens.slice(1, -1)) {
    output += paintText(token) + ` `;
  }

  const lastToken = tokens[tokens.length - 1];
  output += paintText(lastToken);

  return output;
}


export function formatErrorLine(lineNumber, lines) {
  const text = lines[lineNumber - 1]?.trim();
  const content = text ? highlight(text) : ai("<EOF>");

  return spacer() + `${dim(lineNumber)} ${deepPurple("|")} ${content}`;
}
