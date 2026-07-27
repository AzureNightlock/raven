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
      throw new Error(`Expected ${value ?? type}, but reached the end of the file`);
    }

    if (token.type !== type) {
      throw new Error(`Expected ${type}, but got ${token.type} "${token.value}"`);
    }

    if (value !== undefined && token.value !== value) {
      throw new Error(`Expected "${value}", but got "${token.value}"`);
    }

    return token;
  }

  function tokenToSource(token) {
    if (token.type === "STRING") {
      return JSON.stringify(token.value);
    }

    if (token.type === "SYMBOL") {
      const symbols = {
        DOT: ".",
        LEFT_PAREN: "(",
        RIGHT_PAREN: ")",
        LEFT_BRACE: "{",
        RIGHT_BRACE: "}",
        EQUALS: "=",
        GREATER_THAN: ">",
      };

      return symbols[token.value];
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
      throw new Error(`Expected NUMBER or STRING`);
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
    expect("SYMBOL", "LEFT_BRACE");

    let action = "";

    while (peek() && peek().value !== "RIGHT_BRACE") {
      action += tokenToSource(peek());
      advance();
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

    expect("SYMBOL", "LEFT_BRACE");

    const body = [];

    while (peek() && peek().value !== "RIGHT_BRACE") {
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

    if (token.type === "KEYWORD" && token.value === "createElement") {
      return parseCreateElement();
    }

    if (token.type === "IDENTIFIER") {
      const member = tokens[position + 2];
      const nextSymbol = tokens[position + 3];

      if (nextSymbol?.type === "SYMBOL" && nextSymbol.value === "EQUALS") {
        return parsePropertyAssignment();
      }

      if (member?.value.startsWith("on")) {
        return parseEventListener();
      }

      throw new Error(`Expected property assignment or event after "${token.value}"`);
    }

    throw new Error(`Unexpected token ${token.type} "${token.value}"`);
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
