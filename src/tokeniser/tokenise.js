import { isLetter, tokenType } from "./utils.js";
import { OPERATOR_CHARS, SYMBOLS } from "../language/types.js";

export function tokenise(source) {
  const tokens = [];

  let token = "";
  let tokenLine = 1;
  let tokenColumn = 1;

  let tokenCursor = 0;
  let currentLine = 1;
  let currentColumn = 1;

  while (tokenCursor < source.length) {
    const char = source[tokenCursor];

    if (isLetter(char) || (token !== "" && /[0-9]/.test(char))) {
      if (token === "") {
        tokenLine = currentLine;
        tokenColumn = currentColumn;
      }

      token += char;
    }

    // --------------------
    // KEYWORDS + IDENTIFIERS
    else {
      if (token !== "") {
        tokens.push({
          type: tokenType(token),
          value: token,
          line: tokenLine,
          columnStart: tokenColumn,
          columnEnd: tokenColumn + token.length,
          length: token.length,
        });
      } else if (char === '"') {
        const stringLine = currentLine;
        const stringColumn = currentColumn;

        tokenCursor++;
        currentColumn++;

        let str = '"';

        while (tokenCursor < source.length && source[tokenCursor] !== '"') {
          if (source[tokenCursor] === "\n") {
            currentLine++;
            currentColumn = 1;
          } else {
            currentColumn++;
          }

          str += source[tokenCursor];
          tokenCursor++;
        }
        str += '"';

        tokens.push({
          type: "STRING",
          value: str,
          line: stringLine,
          columnStart: stringColumn,
          columnEnd: stringColumn + str.length + 2,
          length: str.length + 2,
        });
      }

      token = "";

      // --------------------
      // SYMBOLS

      if (OPERATOR_CHARS.has(char)) {
        const symbolColumn = currentColumn;
        let tempToken = "";

        while (
          tokenCursor < source.length &&
          OPERATOR_CHARS.has(source[tokenCursor])
        ) {
          tempToken += source[tokenCursor];
          tokenCursor++;
          currentColumn++;
        }

        tokens.push({
          type: tokenType(tempToken),
          value: tempToken,
          line: currentLine,
          columnStart: symbolColumn,
          columnEnd: symbolColumn + tempToken.length,
          length: tempToken.length,
        });

        tokenCursor--;
        currentColumn--;
      } else if (SYMBOLS.has(char)) {
        tokens.push({
          type: tokenType(char),
          value: char,
          line: currentLine,
          columnStart: currentColumn,
          columnEnd: currentColumn + 1,
          length: 1,
        });
      }


      // --------------------
      // NUMBERS

      if (/[0-9]/.test(char)) {
        const numberLine = currentLine;
        const numberColumn = currentColumn;

        let number = "";

        while (
          tokenCursor < source.length &&
          /[0-9]/.test(source[tokenCursor])
        ) {
          number += source[tokenCursor];

          tokenCursor++;
          currentColumn++;
        }

        tokens.push({
          type: "NUMBER",
          value: Number(number),
          line: numberLine,
          columnStart: numberColumn,
          columnEnd: numberColumn + number.length,
          length: number.length,
        });

        tokenCursor--;
        currentColumn--;
      }
    }

    if (char === "\n") {
      currentLine++;
      currentColumn = 1;
    } else {
      currentColumn++;
    }

    tokenCursor++;
  }

  if (token !== "") {
    tokens.push({
      type: tokenType(token),
      value: token,
      line: tokenLine,
      columnStart: tokenColumn,
      columnEnd: tokenColumn + token.length,
      length: token.length,
    });
  }

  tokens.push({
    type: "EOF",
    value: null,
    line: currentLine,
    columnStart: currentColumn,
    columnEnd: currentColumn+1,
    length: 1,
  });

  return tokens;
}
