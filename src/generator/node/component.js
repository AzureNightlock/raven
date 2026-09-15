import { generateNode } from "../generate.js";

export function generateComponent(node, lines) {
  lines.push(`function ${node.varName}() {`);

  for (const statement of node.body) {
    generateNode(statement, lines, null);
  }
  lines.push("}");
}
