import { generateNode } from "../generate.js";

export function generateHtmlElement(node, lines, currentElement) {
  const varName = node.varName;
  lines.push(
    `const ${varName} = document.createElement(${JSON.stringify(node.tagName)});`,
  );

  for (const statement of node.body) {
    generateNode(statement, lines, varName, node.tagName);
  }

  lines.push(`${currentElement ?? "document.body"}.appendChild(${varName});`);
}
