import { parseStatement } from "../parseStatement.js";

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
