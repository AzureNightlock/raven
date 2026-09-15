export function parseMemberAssignment(stream) {
  const object = stream.expect("IDENTIFIER");
  stream.expect("SYMBOL", ".");
  const property = stream.expect("PROPERTY");
  stream.expect("SYMBOL", "=");
  const nextToken = stream.peek();

  let value;

  if (nextToken.type === "NUMBER") {
    value = stream.expect("NUMBER");
  } else if (nextToken.type === "STRING") {
    value = stream.expect("STRING");
  } else if (nextToken.type === "IDENTIFIER") {
    value = stream.expect("IDENTIFIER");
  } else {
    throw new RavenError(
      "SyntaxError",
      `Expected a number, string, or variable, but got ${nextToken.value}`,
      nextToken,
      `Membership assignments must be a literal or variable, like "hello", 42, or x.`,
    );
  }
  return {
    type: "MemberAssignment",
    object: object.value,
    property: property.value,
    value: value.value,
    valueType: value.type,
    token: object,
  };
}
