import { RavenError } from "./errors.js";

const SYMBOLS = {
  DOT: ".",
  LEFT_PAREN: "(",
  RIGHT_PAREN: ")",
  LEFT_BRACE: "{",
  RIGHT_BRACE: "}",
  EQUALS: "=",
  GREATER_THAN: ">",
};

export function parse(tokens) {
  let position = 0;

  const last = tokens[tokens.length - 1];
  const eof = last
    ? {
        type: "EOF",
        value: null,
        line: last.line,
        column: last.column + last.length,
        length: 1,
      }
    : { type: "EOF", value: null, line: 1, column: 1, length: 1 };

  function peek() {
    return tokens[position] ?? eof;
  }

  function advance() {
    const token = tokens[position] ?? eof;
    position++;
    return token;
  }

  function atEnd() {
    return peek().type === "EOF";
  }

  function label(type, value) {
    if (value === undefined) return type;
    return `"${SYMBOLS[value] ?? value}"`;
  }

  function describe(token) {
    return token.type === "EOF"
      ? "the end of the file"
      : `"${tokenToSource(token)}"`;
  }

  function expect(type, value) {
    const token = advance();

    if (token.type === "EOF") {
      throw new RavenError(
        `Expected ${label(type, value)}, but reached the end of the file`,
        token,
      );
    }

    if (token.type !== type) {
      throw new RavenError(
        `Expected ${label(type, value)}, but got ${describe(token)}`,
        token,
      );
    }

    if (value !== undefined && token.value !== value) {
      throw new RavenError(
        `Expected ${label(type, value)}, but got ${describe(token)}`,
        token,
      );
    }

    return token;
  }

  function tokenToSource(token) {
    if (token.type === "STRING") {
      return JSON.stringify(token.value);
    }

    if (token.type === "SYMBOL") {
      return SYMBOLS[token.value];
    }

    return String(token.value);
  }

  function parsePropertyAssignment() {
    // btn.textContent = 5
    //  ↑        ↑       ↑
    // object property value

    const object = expect("IDENTIFIER");

    expect("SYMBOL", "DOT");

    const property = expect("IDENTIFIER");

    expect("SYMBOL", "EQUALS");

    const nextToken = peek();

    let value;

    if (nextToken.type === "NUMBER") {
      value = expect("NUMBER");
    } else if (nextToken.type === "STRING") {
      value = expect("STRING");
    } else {
      throw new RavenError(
        `Expected a number or string, but got ${describe(nextToken)}`,
        nextToken,
        `Property values must be a literal, like "hello" or 42.`,
      );
    }

    return {
      type: "PropertyAssignment",
      object: object.value,
      property: property.value,
      value: value.value,
    };
  }

  function parseEventListener() {
    const object = expect("IDENTIFIER");
    expect("SYMBOL", "DOT");
    const event = expect("IDENTIFIER");
    expect("SYMBOL", "LEFT_PAREN");
    expect("SYMBOL", "LEFT_PAREN");
    expect("SYMBOL", "RIGHT_PAREN");
    expect("SYMBOL", "EQUALS");
    expect("SYMBOL", "GREATER_THAN");
    const open = expect("SYMBOL", "LEFT_BRACE");

    let action = "";

    while (!atEnd() && peek().value !== "RIGHT_BRACE") {
      action += tokenToSource(peek());
      advance();
    }

    if (atEnd()) {
      throw new RavenError(
        `Unclosed handler body for "${event.value}"`,
        open,
        `This "{" is never closed.`,
      );
    }

    expect("SYMBOL", "RIGHT_BRACE");
    expect("SYMBOL", "RIGHT_PAREN");

    return {
      type: "EventListener",
      object: object.value,
      eventType: event.value,
      action: action,
    };
  }

  function parseCreateElement() {
    expect("KEYWORD", "createElement");

    expect("SYMBOL", "LEFT_PAREN");

    const tagName = expect("STRING");

    expect("SYMBOL", "RIGHT_PAREN");

    expect("KEYWORD", "as");

    const alias = expect("IDENTIFIER");

    const open = expect("SYMBOL", "LEFT_BRACE");

    const body = [];

    while (!atEnd() && peek().value !== "RIGHT_BRACE") {
      body.push(parseStatement());
    }

    if (atEnd()) {
      throw new RavenError(
        `Unclosed block for "${alias.value}"`,
        open,
        `This "{" is never closed.`,
      );
    }

    expect("SYMBOL", "RIGHT_BRACE");

    return {
      type: "CreateElementStatement",
      tagName: tagName.value,
      alias: alias.value,
      body,
    };
  }

  function parseStatement() {
    const token = peek();

    if (token.type === "EOF") {
      throw new RavenError("Unexpected end of input", token);
    }

    if (token.type === "KEYWORD" && token.value === "createElement") {
      return parseCreateElement();
    }

    if (token.type === "IDENTIFIER") {
      const member = tokens[position + 2];
      const nextSymbol = tokens[position + 3];

      if (nextSymbol?.type === "SYMBOL" && nextSymbol.value === "EQUALS") {
        return parsePropertyAssignment();
      }

      if (member?.type === "IDENTIFIER" && member.value.startsWith("on")) {
        return parseEventListener();
      }

      throw new RavenError(
        `Expected a property assignment or event handler after "${token.value}"`,
        token,
        `Write "${token.value}.property = value" or "${token.value}.onEvent(() => { ... })".`,
      );
    }

    throw new RavenError(`Unexpected ${token.type} ${describe(token)}`, token);
  }

  const body = [];

  while (position < tokens.length) {
    body.push(parseStatement());
  }

  return {
    type: "root",
    body,
  };
}