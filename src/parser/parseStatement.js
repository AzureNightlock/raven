import { RavenError } from "../errors/errors.js";
import { DATA_TYPES, EVENTS, PROPERTIES, SPECIAL_PROPERTIES } from "../language/types.js";
import { parseCreateElement } from "./statements/createElement.js";
import { parseEventListener } from "./statements/eventListener.js";
import { parseIntegerAssignment } from "./statements/integerAssignment.js";
import { parsePropertyAssignment } from "./statements/propertyAssignment.js";
import { parseStringAssignment } from "./statements/stringAssignment.js";
import { parseMemberAssignment } from "./statements/memberAssignment.js";

export function parseStatement(stream) {
  const token = stream.peek();

  if (DATA_TYPES.has(token.value)) {
    if (token.value === "html") {
      return parseCreateElement(stream);
    }

    if (token.value === "int") {
      return parseIntegerAssignment(stream);
    }

    if (token.value === "str") {
      return parseStringAssignment(stream);
    }
  }

  if (EVENTS.has(token.value)) {
    return parseEventListener(stream);
  }

  if (PROPERTIES.has(token.value) || SPECIAL_PROPERTIES.has(token.value)) {
    return parsePropertyAssignment(stream);
  }

  if (token.type === "IDENTIFIER" && stream.peek(1).value === ".") {
    return parseMemberAssignment(stream);
  }

  throw new RavenError(
    "SyntaxError",
    `Unexpected ${token.type} "${token.value}"`,
    token,
  );
}
