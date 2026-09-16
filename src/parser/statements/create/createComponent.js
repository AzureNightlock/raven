import { parseStatement } from "../../parseStatement.js";

export function parseCreateComponent(stream) {
  stream.expect("DATA_TYPE", "html");
  const varName = stream.expect("IDENTIFIER");
  stream.expect("SYMBOL", "=");
  stream.expect("KEYWORD", "createComponent");
  stream.expect("SYMBOL", "(");
  stream.expect("SYMBOL", ")");
  stream.expect("SYMBOL", "{");

  const body = [];

  while (!stream.atEnd() && !stream.match("SYMBOL", "}")) {
    body.push(parseStatement(stream));
  }

  stream.expect("SYMBOL", "}");

  return {
    type: "CreateComponent",
    varName: varName.value,
    body,
    token: varName,
  };
}
