import { deepPurple, dim} from "../cli/style.js";

export function spacer(spaceSize = 3) {
  return " ".repeat(spaceSize);
}

// function paintText(token) {
//   const paint = TOKEN_COLOURS[token.type];
//   let text = token.value;

//   if (token.type === "STRING") {
//     text = `${token.value}`;
//   }

//   if (token.type === "EOF") {
//     text = "<EOF>";
//   }

//   return paint ? paint(text) : text;
// }

// function highlight(text) {
//   const tokens = tokenise(text);
//   let output = ``;

//   const firstToken = tokens[0];
//   output += paintText(firstToken) + ` `;

//   for (const token of tokens.slice(1, -1)) {
//     output += paintText(token) + ` `;
//   }

//   const lastToken = tokens[tokens.length - 1];
//   output += paintText(lastToken);

//   return output;
// }


export function formatErrorLine(lineNumber, lines) {
  const text = lines[lineNumber - 1];
  // const content = text ? highlight(text) : ai("<EOF>");
  return spacer() + `${dim(lineNumber)} ${deepPurple("|")} ${text}`;
}
