import { RavenError } from "../errors.js";
import { describe, tokenToSource } from "./tokenStream.js";

import { DATA_TYPES, EVENTS } from "../language/types.js";

export function parseStatement(stream) {
  const token = stream.peek();
  const nextToken = stream.peek(1);

  if (token.type === "EOF") {
    throw new RavenError("Unexpected end of input", token);
  }

  if (DATA_TYPES.has(token.value)) {
    if (token.value === "html") {
      if (nextToken.type === "IDENTIFIER") {
        return parseCreateElement(stream);
      }
    }

    // ex: int x
    if (token.value === "int") {
      if (nextToken.type === "IDENTIFIER") {
        return parseVariableAssignment(stream);
      }
    }
  }

  if (EVENTS.has(token.value)) {
    return parseEventListener(stream);
  }

  if (token.type === "IDENTIFIER") {
    if (nextToken.type === "SYMBOL" && nextToken.value === "=") {
      return parsePropertyAssignment(stream);
    }

    throw new RavenError(
      `Expected a property assignment or event handler after "${token.value}`,
      token,
      `Write a html <property> = value or <event>({ ... }).`,
    );
  }

  throw new RavenError(`Unexpected ${token.type} ${describe(token)}`, token);
}

export function parsePropertyAssignment(stream) {
  /* 
  EXAMPLE:
  textContent = 5
      ↑         ↑
  property    value
  */

  const property = stream.expect("IDENTIFIER");

  stream.expect("SYMBOL", "=");

  const nextToken = stream.peek();

  let value;

  if (nextToken.type === "NUMBER") {
    value = stream.expect("NUMBER");
  } else if (nextToken.type === "STRING") {
    value = stream.expect("STRING");
  } else {
    throw new RavenError(
      `Expected a number or string, but got ${describe(nextToken)}`,
      nextToken,
      `Property values must be a literal, like "hello" or 42.`,
    );
  }

  return {
    type: "PropertyAssignment",
    property: property.value,
    value: value.value,
  };
}

export function parseEventListener(stream) {
  const event = stream.expect("EVENT");
  stream.expect("SYMBOL", "(");
  const open = stream.expect("SYMBOL", "{");
  
  let action = "";
  
  while (!stream.atEnd() && !stream.match("SYMBOL", "}")) {
    action += tokenToSource(stream.peek());
    stream.advance();
  }

  if (stream.atEnd()) {
    throw new RavenError(
      `Unclosed handler body for "${event.value}"`,
      open,
      `This "{" is never closed.`,
    );
  }

  stream.expect("SYMBOL", "}");
  stream.expect("SYMBOL", ")");

  return {
    type: "EventListener",
    eventType: event.value,
    action,
  };
}

export function parseCreateElement(stream) {
  stream.expect("DATA_TYPE", "html");

  const varName = stream.expect("IDENTIFIER");
  stream.expect("SYMBOL", "=");
  stream.expect("KEYWORD", "createElement");
  stream.expect("SYMBOL", "(");
  const tagName = stream.expect("STRING");

  stream.expect("SYMBOL", ")");

  stream.expect("SYMBOL", "{");

  const body = [];

  while (!stream.atEnd() && !stream.match("SYMBOL", "}")) {
    body.push(parseStatement(stream));
  }

  stream.expect("SYMBOL", "}");

  return {
    type: "CreateHTMLElement",
    tagName: tagName.value,
    varName: varName.value,
    body,
  };
}

export function parseVariableAssignment(stream) {
  stream.expect("DATA_TYPE", "int");
  const varName = stream.expect("IDENTIFIER");
  stream.expect("SYMBOL", "=");
  const value = stream.expect("NUMBER");

  return {
    type: "CreateIntegerVariable",
    dataType: "int",
    varName: varName.value,
    value: value.value,
  };
}
