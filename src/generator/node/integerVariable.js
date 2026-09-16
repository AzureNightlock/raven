export function generateIntegerVariable(node, lines) {
  lines.push(`let ${node.varName} = ${node.value};`);
}
