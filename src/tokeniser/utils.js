import {
  KEYWORDS,
  DATA_TYPES,
  EVENTS,
  ARITHMETIC_OPERATORS,
  COMPARISON_OPERATORS,
  LOGICAL_OPERATORS,
  SYMBOLS,
  COMPOUND_ASSIGNMENT_OPERATORS,
  PROPERTIES,
  SPECIAL_PROPERTIES,
} from "../language/types.js";

export function isLetter(char) {
  return /[a-zA-Z]/.test(char);
}

const TOKEN_TYPES = new Map([
  ...[...DATA_TYPES].map((value) => [value, "DATA_TYPE"]),
  ...[...KEYWORDS].map((value) => [value, "KEYWORD"]),
  ...[...EVENTS].map((value) => [value, "EVENT"]),
  ...[...SYMBOLS].map((value) => [value, "SYMBOL"]),
  ...[...ARITHMETIC_OPERATORS].map((value) => [value, "ARITHMETIC_OPERATOR"]),
  ...[...COMPARISON_OPERATORS].map((value) => [value, "COMPARISON_OPERATOR"]),
  ...[...LOGICAL_OPERATORS].map((value) => [value, "LOGICAL_OPERATOR"]),
  ...[...COMPOUND_ASSIGNMENT_OPERATORS].map((value) => [
    value,
    "COMPOUND_ASSIGNMENT_OPERATOR",
  ]),
  ...[...PROPERTIES].map((value) => [value, "PROPERTY"]),
  ...[...SPECIAL_PROPERTIES].map((value) => [value, "PROPERTY"]), // might need to change this to special property
]);

export function tokenType(token) {
  return TOKEN_TYPES.get(token) ?? "IDENTIFIER";
}