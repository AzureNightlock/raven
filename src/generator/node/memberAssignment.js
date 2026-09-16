import { RavenError } from "../../errors/errors.js";
import { PROPERTIES } from "../../language/types.js";

export function generateMemberAssignment(
  node,
  lines,
  currentElement,
  currentTagName,
) {

  const value =
    node.valueType === "IDENTIFIER" ? node.value : JSON.stringify(node.value);
  if (PROPERTIES.has(node.property)) {
    lines.push(`${node.object}.${node.property} = ${value};`);
  } else if (node.property === "class") {
    lines.push(`${node.object}.className = ${value};`);
  } else {
    throw new RavenError(
      "PropertyError",
      `Invalid property "${node.varName}" for <${currentTagName}> element "${currentElement}"`,
      node.token,
    );
  }
}
