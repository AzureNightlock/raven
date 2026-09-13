export const DATA_TYPES = new Set(["int", "str", "bool", "html"]);

export const SYMBOLS = new Set(["(", ")", "{", "}", ".", "=", "=>"]);

export const SPECIAL_PROPERTIES = new Set(["class", "render"])

export const PROPERTIES = new Set([
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

export const LOGICAL_OPERATORS = new Set(["&&", "||", "!", "^"]);

export const COMPOUND_ASSIGNMENT_OPERATORS = new Set([
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "**=",
  "&=",
  "^=",
  "|=",
]);

export const OPERATOR_CHARS = new Set(
  [
    ...ARITHMETIC_OPERATORS,
    ...COMPARISON_OPERATORS,
    ...LOGICAL_OPERATORS,
  ].join(""),
);
export const commands = new Set(["init", "compile", "format", "lint"]);

// to be used soon
// const TOKEN_COLOURS = {
//   DATA_TYPE: aka,
//   KEYWORD: deepPurple,
//   EVENT: neonCyan,
//   SYMBOL: deepPurple,
//   ARITHMETIC_OPERATOR: deepPurple,
//   COMPARISON_OPERATOR: deepPurple,
//   LOGICAL_OPERATOR: deepPurple,
//   COMPOUND_ASSIGNMENT_OPERATOR: deepPurple,
//   STRING: yamabuki,
//   NUMBER: yamabuki,
//   EOF: ai,
// };