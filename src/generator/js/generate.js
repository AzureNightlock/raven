import { generateNode } from "../generateNode.js";

export function generateJavaScript(ast) {
  const lines = [];

  for (const node of ast.body) {
    generateNode(node, lines);
  }

  return lines.join("\n");
}
