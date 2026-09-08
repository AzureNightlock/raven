import { RavenError } from "../errors/errors.js";

export class Scope {
  constructor(name, parentScope = null) {
    this.name = name;
    this.parentScope = parentScope;
    this.symbols = new Map();
  }
}

function walkNode(node, scope) {
    if (scope.symbols.has(node.varName)) {
        console.log(node.value+"d")
      throw new RavenError(
        "DeclarationError",
        `"${node.varName}" has already been declared`,
        node.token,
        `Rename ${node.varName} to something else`
      );
    }
  if (node.type === "CreateIntegerVariable") {
    scope.symbols.set(node.varName, {
      name: node.varName,
      type: "int",
      kind: "variable",
    });

    return;
  }

  if (node.type === "CreateHTMLElement") {
    scope.symbols.set(node.varName, {
      name: node.varName,
      type: "html",
      kind: "element",
    });

  }
}

export function buildSymbolTable(ast) {
  const globalScope = new Scope("global");

  for (const node of ast.body) {
    walkNode(node, globalScope);
  }

  return globalScope;
}