import { RavenError } from "../errors.js";
import { properties } from "../language/types.js";

export function generateNode(node, lines, currentElement) {
  if (node.type === "CreateHTMLElement") {
    const varName = node.varName;
    lines.push(
      `const ${varName} = document.createElement(${JSON.stringify(node.tagName)});`,
    );

    for (const statement of node.body) {
      generateNode(statement, lines, varName);
    }

    lines.push(`${currentElement ?? "document.body"}.appendChild(${varName});`);
  }

  if (node.type === "PropertyAssignment") {
    if (!currentElement) {
      throw new RavenError(
        `Property "${node.property}" property must be inside an html element`,
      );
    }

    if (properties.has(node.property)) {
      lines.push(
        `${currentElement}.${node.property} = ${JSON.stringify(node.value)};`,
      );
    } else if (node.property === "class") {
      lines.push(
        `${currentElement}.className = ${JSON.stringify(node.value)};`,
      );
    } else {
      throw new RavenError(
        `Invalid Property. ${node.property} doesn't exist for ${currentElement}`,
      );
    }
  } else if (node.type === "EventListener") {
    if (!currentElement) {
      throw new RavenError(
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
    lines.push(`let ${node.varName} = ${node.value}`);
  } else {
    throw new RavenError(
      `Invalid Property. ${node.property} doesn't exist for ${currentElement}`,
    );
  }
}
