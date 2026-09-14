import { RavenError } from "../../errors/errors.js";

export function generateEventListener(node, lines, currentElement) {
  if (!currentElement) {
    throw new RavenError(
      "SyntaxError",
      `"${node.eventType}" event must be inside an html element`,
    );
  }

  const eventName = node.eventType.slice(2).toLowerCase();

  lines.push(
    `${currentElement}.addEventListener(${JSON.stringify(eventName)}, () => {`,
  );

  lines.push(`  ${node.action};`);
  lines.push(`});`);
}
