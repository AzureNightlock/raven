import { RavenError } from "../errors/errors.js";

export function createTokenStream(tokens) {
  let position = 0;

  return {
    peek(offset = 0) {
      return tokens[position + offset];
    },

    advance() {
      return tokens[position++];
    },

    atEnd() {
      return this.peek().type === "EOF";
    },

    expect(type, value) {
      const token = this.advance();

      if (token.type === "EOF") {
        throw new RavenError(
          "EOFError",
          `Expected ${value ?? type}, but reached the end of the file`,
          token,
          `Add the missing "${value ?? type}" before the end of the file.`,
        );
      }

      if (token.type !== type) {
        throw new RavenError(
          "SyntaxError",
          `Expected type ${type}, but got ${token.type}: "${token.value}"`,
          token,
        );
      }

      if (value !== undefined && token.value !== value) {
        throw new RavenError(
          "SyntaxError",
          `Expected ${value}, but got "${token.value}"`,
          token,
        );
      }

      return token;
    },

    match(type, value) {
      const token = this.peek();
      return (
        token.type === type && (value === undefined || token.value === value)
      );
    },
  };
}
