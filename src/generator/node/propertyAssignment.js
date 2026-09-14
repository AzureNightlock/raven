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
      `Property "${node.varName}" property must be inside an html element`,
    );
  }

  if (PROPERTIES.has(node.varName)) {
    const value =
      node.valueType === "IDENTIFIER" ? node.value : JSON.stringify(node.value);

    lines.push(`${currentElement}.${node.varName} = ${value};`);
  } else {
    throw new RavenError(
      "PropertyError",
      `Invalid property "${node.varName}" for <${currentTagName}> element "${currentElement}"`,
    );
  }
}
