import { generateNode } from "../generate.js";

export function generateComponent(node, lines) {
  lines.push(`function ${node.varName}() {`);

  const elements = [];

  for (const statement of node.body) {
    generateNode(statement, lines, null);

    if (statement.type === "CreateHTMLElement") {
      elements.push(statement.varName);
    }
  }

  lines.push(`return [${elements.join(", ")}];`);
  lines.push(`}`);
}
