const useColor =
  process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== "dumb";

const useUnicode =
  process.env.TERM !== "dumb" &&
  (process.platform !== "win32" ||
    Boolean(process.env.WT_SESSION) ||
    Boolean(process.env.TERM_PROGRAM));

const paint = (code) => (text) =>
  useColor ? `\x1b[${code}m${text}\x1b[0m` : text;

const purple = paint("38;5;141");
const red = paint("38;5;203");
const bold = paint("1");
const dim = paint("2");

const CHARS = useUnicode
  ? { mark: "x", bar: "│", ann: "·", open: "╭─", close: "╰────", under: "─" }
  : { mark: "x", bar: "|", ann: ":", open: "+-", close: "+----", under: "^" };

const TAB_WIDTH = 4;

export class RavenError extends Error {
  constructor(message, token, hint) {
    super(message);
    this.name = "RavenError";
    this.token = token;
    this.hint = hint;
  }
}

function expandTabs(text) {
  let out = "";
  for (const char of text) {
    if (char === "\t") out += " ".repeat(TAB_WIDTH - (out.length % TAB_WIDTH));
    else out += char;
  }
  return out;
}

function visualColumn(rawLine, column) {
  return expandTabs(rawLine.slice(0, column - 1)).length + 1;
}

export function renderError(error, source, file = "<anonymous>") {
  if (!error.token) return `${red(CHARS.mark)} ${bold(error.message)}`;

  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const { line, column, length } = error.token;

  const raw = lines[line - 1] ?? "";
  const text = expandTabs(raw);
  const caretColumn = visualColumn(raw, column);
  const caretLength = Math.max(
    1,
    Math.min(
      expandTabs(raw.slice(column - 1, column - 1 + length)).length,
      Math.max(1, text.length - caretColumn + 1),
    ),
  );

  const width = String(Math.min(line + 1, lines.length)).length;
  const gutter = " ".repeat(width);
  const pad = (n) => String(n).padStart(width);
  const indent = " ".repeat(caretColumn - 1);

  const out = [
    `  ${red(CHARS.mark)} ${bold(error.message)}`,
    `${gutter} ${CHARS.open}[${dim(`${file}:${line}:${column}`)}]`,
  ];

  if (line - 2 >= 0) {
    out.push(`${pad(line - 1)} ${CHARS.bar} ${expandTabs(lines[line - 2])}`);
  }

  out.push(`${pad(line)} ${CHARS.bar} ${text}`);
  out.push(
    `${gutter} ${CHARS.ann} ${indent}${red(CHARS.under.repeat(caretLength))}`,
  );

  if (line < lines.length) {
    out.push(`${pad(line + 1)} ${CHARS.bar} ${expandTabs(lines[line])}`);
  }

  out.push(`${gutter} ${CHARS.close}`);

  if (error.hint) out.push(`  ${purple("help:")} ${error.hint}`);

  return out.join("\n");
}

export function reportAndExit(error, source, file) {
  if (!(error instanceof RavenError)) throw error;
  console.error(renderError(error, source, file));
  process.exit(1);
}