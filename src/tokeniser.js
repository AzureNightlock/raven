import { KEYWORDS, DATA_TYPES, EVENTS, ARITHMETIC_OPERATORS, COMPARISON_OPERATORS, LOGICAL_OPERATORS } from "./language/types.js";

function isLetter(char) {
  return /[a-zA-Z]/.test(char);
}

export function tokenize(source) {
  source = source.replace(/\r\n?/g, "\n");
  const tokens = [];
  let word = "";
  let wordLine = 1;
  let wordColumn = 1;
  let i = 0;
  let line = 1;
  let column = 1;

  while (i < source.length) {
    const char = source[i];

    if (isLetter(char) || (word !== "" && /[0-9]/.test(char))) {
      if (word === "") {
        wordLine = line;
        wordColumn = column;
      }
      word += char;
    }
    // --------------------
    // KEYWORDS + IDENTIFIERS
    else {
      if (word !== "") {
        let type;
        if (DATA_TYPES.has(word)) {
          type = "DATA_TYPE";
        } else if (KEYWORDS.has(word)) {
          type = "KEYWORD";
        } else if (EVENTS.has(word)) {
          type = "EVENT";
        } else if (ARITHMETIC_OPERATORS.has(word)) {
          type = "ARITHMETIC_OPERATOR";
        } else if (COMPARISON_OPERATORS.has(word)) {
          type = "COMPARISON_OPERATOR";
        } else if (LOGICAL_OPERATORS.has(word)) {
          type = "LOGICAL_OPERATOR";
        } else {
          type = "IDENTIFIER";
        }

        tokens.push({
          type,
          value: word,
          line: wordLine,
          column: wordColumn,
          length: word.length,
        });
        word = "";
      } else if (char === '"') {
        // for string: "button"
        const stringLine = line;
        const stringColumn = column;
        i++;
        column++;
        let str = "";

        while (i < source.length && source[i] !== '"') {
          if (source[i] === "\n") {
            line++;
            column = 1;
          } else {
            column++;
          }
          str += source[i];
          i++;
        }

        tokens.push({
          type: "STRING",
          value: str,
          line: stringLine,
          column: stringColumn,
          length: str.length + 2,
        });
      }

      word = "";
      // --------------------
      // SYMBOLS
      if (char === "(") {
        tokens.push({
          type: "SYMBOL",
          value: "LEFT_PAREN",
          line,
          column,
          length: 1,
        });
      } else if (char === ")") {
        tokens.push({
          type: "SYMBOL",
          value: "RIGHT_PAREN",
          line,
          column,
          length: 1,
        });
      } else if (char === "{") {
        tokens.push({
          type: "SYMBOL",
          value: "LEFT_BRACE",
          line,
          column,
          length: 1,
        });
      } else if (char === "}") {
        tokens.push({
          type: "SYMBOL",
          value: "RIGHT_BRACE",
          line,
          column,
          length: 1,
        });
      } else if (char === ".") {
        tokens.push({ type: "SYMBOL", value: "DOT", line, column, length: 1 });
      } else if (char === "=" && source[i + 1] === ">") {
        tokens.push({
          type: "SYMBOL",
          value: "ARROW",
          line,
          column,
          length: 2,
        });
        i++;
        column++;
      } else if (char === "=") {
        tokens.push({
          type: "SYMBOL",
          value: "EQUALS",
          line,
          column,
          length: 1,
        });
      }

      // --------------------
      // NUMBERS
      if (/[0-9]/.test(char)) {
        const numberLine = line;
        const numberColumn = column;
        let number = "";

        while (i < source.length && /[0-9]/.test(source[i])) {
          number += source[i];
          i++;
          column++;
        }

        tokens.push({
          type: "NUMBER",
          value: Number(number),
          line: numberLine,
          column: numberColumn,
          length: number.length,
        });

        i--;
        column--;
      }
    }

    if (char === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
    i++;
  }
  return tokens;
}
