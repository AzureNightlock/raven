import fs from "fs";
import path from "path";

export function generate(ast) {
  const outputDirectory = "output";

  fs.mkdirSync(outputDirectory, {
    recursive: true,
  });

  const html = generateHTML();
  const javascript = generateJavaScript(ast);

  fs.writeFileSync(path.join(outputDirectory, "index.html"), html);

  fs.writeFileSync(path.join(outputDirectory, "script.js"), javascript);
}

function generateHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Raven App</title>
  <script src="script.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body>
</body>
</html>
`;
}

function generateJavaScript(ast) {
  const lines = [];

  for (const node of ast.body) {
    generateNode(node, lines);
  }

  return lines.join("\n");
}

function generateNode(node, lines) {
  if (node.type === "CreateElementStatement") {
    lines.push(`const ${node.alias} = document.createElement(${JSON.stringify(node.tagName)});`);

    lines.push("");

    for (const statement of node.body) {
      generateNode(statement, lines);
    }

    lines.push("");
    lines.push(`document.body.appendChild(${node.alias});`);
  }

  if (node.type === "PropertyAssignment") {
    if (node.property === "textContent") {
      lines.push(`${node.object}.${node.property} = ${JSON.stringify(node.value)};`);
    } else if (node.property === "class") {
      lines.push(`${node.object}.className = ${JSON.stringify(node.value)};`);
    } else {
      throw new Error("Invalid property");
    }
  } else if (node.type === "EventListener") {
    const eventName = node.eventType.slice(2).toLowerCase();

    lines.push(`${node.object}.addEventListener(${JSON.stringify(eventName)}, () => {`);

    lines.push(`  ${node.action};`);
    lines.push(`});`);
  }
}
