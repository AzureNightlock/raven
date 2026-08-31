export function tokenToString(token) {
  if (token.type === "STRING") {
    return JSON.stringify(token.value);
  }

  return String(token.value);
}
