import { tokenToString } from "../utils.js";
import { RavenError } from "../../errors/errors.js";

export function parseEventListener(stream) {
  const event = stream.expect("EVENT");
  stream.expect("SYMBOL", "(");
  const open = stream.expect("SYMBOL", "{");
  let action = "";

  while (!stream.atEnd() && !stream.match("SYMBOL", "}")) {
    const token = stream.peek();
    action += tokenToString(token);
    stream.advance();
  }

  if (stream.atEnd()) {
    throw new RavenError(
      "SyntaxError",
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
