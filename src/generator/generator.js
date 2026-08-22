import fs from "fs";
import path from "path";
import { generateNode } from "./generateNode.js";

export function generate(javascriptGen) {
  const outputDirectory = "output";

  fs.mkdirSync(outputDirectory, {
    recursive: true,
  });

  const html = generateHTML();
  const javascript = javascriptGen;

  const htmlPath = path.join(outputDirectory, "index.html")
  const javascriptPath = path.join(outputDirectory, "script.js")
  
  fs.writeFileSync(htmlPath, html);
  fs.writeFileSync(javascriptPath, javascript);

  return [htmlPath, javascriptPath]
}

function generateHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Raven</title>
  <script src="script.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body>
</body>
</html>
`;
}

export function generateJavaScript(ast) {
  const lines = [];

  for (const node of ast.body) {
    generateNode(node, lines);
  }

  return lines.join("\n");
}

export function generateSetup() {
  const srcDirectory = path.join(process.cwd(), "src");
  const pageFile = path.join(srcDirectory, "page.rvn");

  if (fs.existsSync(pageFile)) {
    return {
      srcCreated: false,
      pageCreated: false,
    };
  }

  if (fs.existsSync(srcDirectory)) {
    fs.writeFileSync(pageFile, "", "utf8");

    return {
      srcCreated: false,
      pageCreated: true,
    };
  }

  fs.mkdirSync(srcDirectory, { recursive: true });
  fs.writeFileSync(pageFile, "", "utf8");

  return {
    srcCreated: true,
    pageCreated: true,
  };
}
