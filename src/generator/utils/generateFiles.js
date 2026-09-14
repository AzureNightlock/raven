import fs from "fs";
import path from "path";
import { generateHTML } from "./generateHTML.js";

export function generateFiles(javascriptGen) {
  const outputDirectory = "output";

  fs.mkdirSync(outputDirectory, {
    recursive: true,
  });

  const html = generateHTML();
  const javascript = javascriptGen;

  const htmlPath = path.join(outputDirectory, "index.html");
  const javascriptPath = path.join(outputDirectory, "script.js");

  fs.writeFileSync(htmlPath, html);
  fs.writeFileSync(javascriptPath, javascript);

  return [htmlPath, javascriptPath];
}
