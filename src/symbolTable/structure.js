import { RavenError } from "../errors/errors.js";

export class Scope {
  constructor(name, parentScope) {
    this.name = name;
    this.parentScope = parentScope;
    this.symbols = new Map();
  }
}

function define(scope, name, type, kind, token, checkName = name) {
  if (scope.symbols.has(checkName)) {
    throw new RavenError(
      "DeclarationError",
      `"${name}" has already been declared at scope: "${scope.name}"`,
      token,
      `Rename ${name} to something else`,
    );
  }

  scope.symbols.set(name, {
    name,
    type,
    kind,
  });
}

function walkNode(node, scope) {
  if (node.type === "CreateIntegerVariable") {
    define(scope, node.varName, "int", "variable", node.token);
  }

  if (node.type === "CreateHTMLElement") {
    define(scope, node.varName, "html", "element", node.token);

    const elementScope = new Scope(node.varName, scope);

    for (const child of node.body) {
      walkNode(child, elementScope);
    }
  }

  if (node.type === "PropertyAssignment") {
    define(scope, node.varName, "html", "property", node.token, node.property);
  }
}

export function buildSymbolTable(ast) {
  const globalScope = new Scope("global");

  for (const node of ast.body) {
    walkNode(node, globalScope);
  }

  return globalScope;
}
