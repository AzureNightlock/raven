export const DATA_TYPES = new Set(["int", "str", "bool", "html"]);

export const SYMBOLS = {
  DOT: ".",
  LEFT_PAREN: "(",
  RIGHT_PAREN: ")",
  LEFT_BRACE: "{",
  RIGHT_BRACE: "}",
  EQUALS: "=",
  GREATER_THAN: ">",
};

export const properties = new Set([
  // All elements
  "textContent",
  "innerText",
  "innerHTML",
  "id",
  "title",
  "hidden",
  "lang",
  "dir",
  "tabIndex",
  "style",
  "dataset",

  // Forms
  "value",
  "name",
  "type",
  "placeholder",
  "checked",
  "disabled",
  "required",
  "readOnly",
  "multiple",
  "min",
  "max",
  "step",
  "minLength",
  "maxLength",
  "pattern",
  "autocomplete",

  // Links and media
  "href",
  "target",
  "download",
  "rel",
  "src",
  "alt",
  "width",
  "height",

  // Tables and lists
  "colSpan",
  "rowSpan",
  "start",
  "reversed",
]);

export const KEYWORDS = new Set([
  "createElement",
  "if",
  "while",
  "for",
  "func",
]);

export const EVENTS = new Set(["onClick"]);

// keep this for time being
export const ARITHMETIC_OPERATORS = new Set(["+", "-", "*", "/", "%", "**"]);

export const COMPARISON_OPERATORS = new Set(["==", "!=", ">", "<", ">=", "<="]);

export const LOGICAL_OPERATORS = new Set(["&&", "||", "!"]);

export const commands = new Set(["init", "compile", "format", "lint"]);