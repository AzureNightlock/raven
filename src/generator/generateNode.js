import { properties } from "../language/types.js";

let elementId = 0;

export function generateNode(node, lines, parent) {
  if (node.type === "CreateElementStatement") {
    const elementName = `_rvn${elementId++}`;
    lines.push(`const ${elementName} = document.createElement(${JSON.stringify(node.tagName)});`);

    lines.push("");

    for (const statement of node.body) {
      generateNode(statement, lines, elementName);
    }

    lines.push("");
    lines.push(`${parent ?? "document.body"}.appendChild(${elementName});`);
  }

  if (node.type === "PropertyAssignment") {
    if (properties.has(node.property)) {
      lines.push(`${node.object}.${node.property} = ${JSON.stringify(node.value)};`);
    } else if (node.property === "class") {
      lines.push(`${node.object}.className = ${JSON.stringify(node.value)};`);
    } else {
      throw new RavenError(`Invalid Property. ${node.property} doesn't exist for ${node.object}`);
    }
  } else if (node.type === "EventListener") {
    const eventName = node.eventType.slice(2).toLowerCase();

    lines.push(`${node.object}.addEventListener(${JSON.stringify(eventName)}, () => {`);

    lines.push(`  ${node.action};`);
    lines.push(`});`);
  } 
}
