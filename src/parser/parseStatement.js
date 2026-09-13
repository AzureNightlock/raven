import { RavenError } from "../errors/errors.js";
import { DATA_TYPES, EVENTS, PROPERTIES, SPECIAL_PROPERTIES } from "../language/types.js";
import { parseCreateElement } from "./statements/createElement.js";
import { parseEventListener } from "./statements/eventListener.js";
import { parsePropertyAssignment } from "./statements/propertyAssignment.js";
import { parseVariableAssignment } from "./statements/variableAssignment.js";

export function parseStatement(stream) {
  const token = stream.peek();

  if (DATA_TYPES.has(token.value)) {
    if (token.value === "html") {
      return parseCreateElement(stream);
    }

    // ex: int x
    if (token.value === "int") {
      return parseVariableAssignment(stream);
    }
  }

  if (EVENTS.has(token.value)) {
    return parseEventListener(stream);
  }

  if (PROPERTIES.has(token.value) || SPECIAL_PROPERTIES.has(token.value)) {
    return parsePropertyAssignment(stream);
  }

  throw new RavenError(
    "SyntaxError",
    `Unexpected ${token.type} "${token.value}"`,
    token,
  );
}
