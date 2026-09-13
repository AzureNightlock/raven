import { RavenError } from "../errors/errors.js";
import { PROPERTIES, SPECIAL_PROPERTIES } from "../language/types.js";

export function generateNode(node, lines, currentElement, currentTagName) {
  if (node.type === "CreateHTMLElement") {
    const varName = node.varName;
    lines.push(
      `const ${varName} = document.createElement(${JSON.stringify(node.tagName)});`,
    );

    for (const statement of node.body) {
      generateNode(statement, lines, varName, node.tagName);
    }

    lines.push(`${currentElement ?? "document.body"}.appendChild(${varName});`);
  } else if (node.type === "PropertyAssignment") {
    if (!currentElement) {
      throw new RavenError(
        "PropertyError",
        `Property "${node.varName}" property must be inside an html element`,
      );
    }

    if (PROPERTIES.has(node.varName)) {
      lines.push(
        `${currentElement}.${node.varName} = ${JSON.stringify(node.value)};`,
      );
    } else if (SPECIAL_PROPERTIES.has(node.varName)) {
      if (node.varName === "class")
      lines.push(
        `${currentElement}.className = ${JSON.stringify(node.value)};`,
      );
    } else {
      throw new RavenError(
        "PropertyError",
        `Invalid property "${node.varName}" for <${currentTagName}> element "${currentElement}"`,
      );
    }
  } else if (node.type === "EventListener") {
    if (!currentElement) {
      throw new RavenError(
        "SyntaxError",
        `"${node.eventType}" event must be inside an html element`,
      );
    }

    const eventName = node.eventType.slice(2).toLowerCase();

    lines.push(
      `${currentElement}.addEventListener(${JSON.stringify(eventName)}, () => {`,
    );

    lines.push(`  ${node.action};`);
    lines.push(`});`);
  } else if (node.type === "CreateIntegerVariable") {
    lines.push(`let ${node.varName} = ${node.value};`);
  } else {
    throw new RavenError("TypeError", `Unknown node type: ${node.type}`);
  }
}
