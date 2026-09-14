import { RavenError } from "../errors/errors.js";
import { generateHtmlElement } from "./node/htmlElement.js";
import { generatePropertyAssignment } from "./node/propertyAssignment.js";
import { generateEventListener } from "./node/eventListener.js";
import { generateIntegerVariable } from "./node/integerVariable.js";
import { generateStringVariable } from "./node/stringVariable.js";

export function generateJavaScript(ast) {
  const lines = [];

  for (const node of ast.body) {
    generateNode(node, lines);
  }

  return lines.join("\n");
}

export function generateNode(node, lines, currentElement, currentTagName) {
  if (node.type === "CreateHTMLElement") {
    generateHtmlElement(node, lines, currentElement);
  } else if (node.type === "PropertyAssignment") {
    generatePropertyAssignment(node, lines, currentElement, currentTagName);
  } else if (node.type === "EventListener") {
    generateEventListener(node, lines, currentElement);
  } else if (node.type === "CreateIntegerVariable") {
    generateIntegerVariable(node, lines);
  } else if (node.type === "CreateStringVariable") {
    generateStringVariable(node, lines);
  } else {
    throw new RavenError("TypeError", `Unknown node type: ${node.type}`);
  }
}
