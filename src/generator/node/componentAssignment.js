export function generateComponentAssignment(node, lines, currentElement) {
  lines.push(`const ${node.varName} = ${node.component}();`);

  if (currentElement !== null) {
    lines.push(
      `${currentElement ?? "document.body"}.appendChild(${node.varName});`,
    );
  }
}
