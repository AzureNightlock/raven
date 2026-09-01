import { RavenError } from "../errors.js";
import { DATA_TYPES, EVENTS } from "../language/types.js";
import { parseCreateElement } from "./statements/createElement.js";
import { parseEventListener } from "./statements/eventListener.js";
import { parsePropertyAssignment } from "./statements/propertyAssignment.js";
import { parseVariableAssignment } from "./statements/variableAssignment.js";

export function parseStatement(stream) {
  const token = stream.peek();
  const nextToken = stream.peek(1);

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
      "SyntaxError",
      `Expected a property assignment or event handler after "${token.value}"`,
      token,
      `Write a html <property> = value or <event>({ ... }).`,
    );
  }

  throw new RavenError(
    "SyntaxError",
    `Unexpected ${token.type} "${token.value}"`,
    token,
  );
}
