import { RavenError } from "../../errors/errors.js";

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
      "SyntaxError",
      `Expected a number or string, but got ${nextToken.value}`,
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
