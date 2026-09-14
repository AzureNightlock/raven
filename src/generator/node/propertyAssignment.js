import { RavenError } from "../../errors/errors.js";
import { PROPERTIES } from "../../language/types.js";

export function generatePropertyAssignment(
  node,
  lines,
  currentElement,
  currentTagName,
) {
  if (!currentElement) {
    throw new RavenError(
      "PropertyError",
      `Property "${node.varName}" must be inside an html element`,
      node.token,
    );
  }

  const value =
    node.valueType === "IDENTIFIER" ? node.value : JSON.stringify(node.value);

  if (PROPERTIES.has(node.varName)) {
    lines.push(`${currentElement}.${node.varName} = ${value};`);
  } else if (node.varName === "class") {
    lines.push(`${currentElement}.className = ${value};`);
  } else {
    throw new RavenError(
      "PropertyError",
      `Invalid property "${node.varName}" for <${currentTagName}> element "${currentElement}"`,
      node.token,
    );
  }
}
