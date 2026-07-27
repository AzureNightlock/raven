export function parse(tokens) {
  let position = 0;

  function peek() {
    return tokens[position];
  }

  function advance() {
    return tokens[position++];
  }

  function expect(type, value) {
    const token = advance();

    if (!token) {
      throw new Error(
        `Expected ${value ?? type}, but reached the end of the file`,
      );
    }

    if (token.type !== type) {
      throw new Error(
        `Expected ${type}, but got ${token.type} "${token.value}"`,
      );
    }

    if (value !== undefined && token.value !== value) {
      throw new Error(
        `Expected "${value}", but got "${token.value}"`,
      );
    }

    return token;
  }

  function parsePropertyAssignment() {
    const object = expect("IDENTIFIER");

    expect("SYMBOL", "DOT");

    const property = expect("IDENTIFIER");

    expect("SYMBOL", "EQUALS");

    const value = expect("NUMBER");

    return {
      type: "PropertyAssignment",
      object: object.value,
      property: property.value,
      value: Number(value.value),
    };
  }

  function parseCreateElement() {
    expect("KEYWORD", "createElement");

    expect("SYMBOL", "LEFT_PAREN");

    const tagName = expect("STRING");

    expect("SYMBOL", "RIGHT_PAREN");

    expect("KEYWORD", "as");

    const alias = expect("IDENTIFIER");

    expect("SYMBOL", "LEFT_BRACE");

    const body = [];

    while (
      peek() &&
      peek().value !== "RIGHT_BRACE"
    ) {
      body.push(parseStatement());
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

    if (!token) {
      throw new Error("Unexpected end of input");
    }

    if (
      token.type === "KEYWORD" &&
      token.value === "createElement"
    ) {
      return parseCreateElement();
    }

    if (token.type === "IDENTIFIER") {
      return parsePropertyAssignment();
    }

    throw new Error(
      `Unexpected token ${token.type} "${token.value}"`,
    );
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