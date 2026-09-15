import { RavenError } from "../errors/errors.js";
import {
  DATA_TYPES,
  EVENTS,
  PROPERTIES,
  SPECIAL_PROPERTIES,
} from "../language/types.js";
import { parseCreateElement } from "./statements/create/createElement.js";
import { parseEventListener } from "./statements/assignment/eventListener.js";
import { parseIntegerAssignment } from "./statements/assignment/integerAssignment.js";
import { parsePropertyAssignment } from "./statements/assignment/propertyAssignment.js";
import { parseStringAssignment } from "./statements/assignment/stringAssignment.js";
import { parseMemberAssignment } from "./statements/assignment/memberAssignment.js";
import { parseCreateComponent } from "./statements/create/createComponent.js";
import { parseComponentAssignment } from "./statements/assignment/componentAssignment.js";

export function parseStatement(stream) {
  const token = stream.peek();

  if (DATA_TYPES.has(token.value)) {
    if (token.value === "html") {
      if (stream.peek(3).value === "createElement") return parseCreateElement(stream);
      if (stream.peek(3).value === "createComponent") return parseCreateComponent(stream);
      if (stream.peek(3).type === "IDENTIFIER") return parseComponentAssignment(stream);
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
