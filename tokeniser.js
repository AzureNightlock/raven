import fs from "fs";

const KEYWORDS = new Set([
  "createElement",
  "as",
]);
const source = fs.readFileSync("page.rvn", "utf-8");
const tokens = tokenize(source);


console.log(tokens);

function isLetter(char) {
  return /[a-zA-Z]/.test(char);
}

function skipWhitespace() {
  while (
    source[position] === " " ||
    source[position] === "\t" ||
    source[position] === "\n"
  ) {
    if (source[position] === "\n") {
      row++;
      column = 1;
    }
    else {
      column++;
    }

    position++;
  }
}
export function tokenize(source) {
  const tokens = [];
  let word = "";
  let i = 0;
  let line = 1;

  while (i < source.length) {
    const char = source[i];

    if (char === "\n") {
      line++;
    }

    if (isLetter(char)) {
      word += char;
    }
    // --------------------
    // KEYWORDS + IDENTIFIERS
    else {
      if (word !== "") {
        tokens.push({
          type: KEYWORDS.has(word) ? "KEYWORD" : "IDENTIFIER",
          value: word,
        });

        word = "";
      }
      else if (char === '"') {
        // for string: "button"
        i++;
        let str = "";

        while (i < source.length && source[i] !== '"') {
          str += source[i];
          i++;
        }

        tokens.push({ type: "STRING", value: str });
      }

      word = "";
      // --------------------
      // SYMBOLS
      if (char === "(") {
        tokens.push({ type: "SYMBOL", value: "LEFT_PAREN" });
      } else if (char === ")") {
        tokens.push({ type: "SYMBOL", value: "RIGHT_PAREN" });
      } else if (char === "{") {
        tokens.push({ type: "SYMBOL", value: "LEFT_BRACE" });
      } else if (char === "}") {
        tokens.push({ type: "SYMBOL", value: "RIGHT_BRACE" });
      } else if (char === ".") {
        tokens.push({ type: "SYMBOL", value: "DOT" });
      }
      else if (char === "=") {
        tokens.push({ type: "SYMBOL", value: "EQUALS" });
      }
      // --------------------
      // NUMBERS
      if (/[0-9]/.test(char)) {
        let number = "";

        while (i < source.length && /[0-9]/.test(source[i])) {
          number += source[i];
          i++;
        }

        tokens.push({
          type: "NUMBER",
          value: Number(number),
        });

        i--;
      }
        
    }

    console.log(char, word);
    i++;
  }

  return tokens;
}
