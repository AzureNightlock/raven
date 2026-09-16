export function generateComponentAssignment(node, lines, currentElement) {
  lines.push(`const ${node.varName} = ${node.component}();`);

  if (currentElement !== null) {
    const parent = currentElement ?? "document.body";

    lines.push(`for (const element of ${node.varName}) {`);
    lines.push(`  ${parent}.appendChild(element);`);
    lines.push(`}`);
  }
}
