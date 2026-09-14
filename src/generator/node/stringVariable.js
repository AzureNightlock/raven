export function generateStringVariable(node, lines) {
  lines.push(`let ${node.varName} = "${node.value}";`);
}
