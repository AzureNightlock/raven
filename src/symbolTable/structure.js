import { RavenError } from "../errors/errors.js";

export class Scope {
  constructor(name, parentScope) {
    this.name = name;
    this.parentScope = parentScope;
    this.symbols = new Map();
  }
}

function define(scope, name, type, kind, token) {
  if (scope.symbols.has(name)) {
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

function lookup(scope, name) {
  while (scope) {
    if (scope.symbols.has(name)) return scope.symbols.get(name);
    scope = scope.parentScope;
  }
}


function walkNode(node, scope) {
  if (node.type === "CreateIntegerVariable") {
    define(scope, node.varName, "int", "variable", node.token);
  }

  if (node.type === "CreateStringVariable") {
    define(scope, node.varName, "str", "variable", node.token);
  }

  if (node.type === "CreateHTMLElement") {
    define(scope, node.varName, "html", "element", node.token);

    const elementScope = new Scope(node.varName, scope);

    for (const child of node.body) {
      walkNode(child, elementScope);
    }
  }

  if (node.type === "PropertyAssignment") {
    define(scope, node.varName, "html", "property", node.token);
  }

  if (node.type === "EventListener") {
    define(scope, node.eventType, "html", "event", node.token);
  }
  if (node.type === "MemberAssignment") {
    const symbol = lookup(scope, node.object);

    if (!symbol) {
      throw new RavenError(
        "ReferenceError",
        `"${node.object}" is not defined`,
        node.token,
      );
    }

    if (symbol.kind !== "element") {
      throw new RavenError(
        "TypeError",
        `"${node.object}" is a ${symbol.type}, not an html element`,
        node.token,
      );
    }
  }
}

export function buildSymbolTable(ast) {
  const globalScope = new Scope("global");

  for (const node of ast.body) {
    walkNode(node, globalScope);
  }

  return globalScope;
}
