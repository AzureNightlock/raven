export function generateStringVariable(node, lines) {
  lines.push(`let ${node.varName} = ${JSON.stringify(node.value)};`);
}
