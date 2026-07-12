
fs.readFileSync("temp.tsx", "utf8");

const chunks = [];
let buffer = "";
let insideTag = false;

for (let i = 0; i < str.length; i++) {
  const char = str[i];

  if (char === "<") {
    // Save any text collected before the tag
    if (buffer.trim()) {
      chunks.push(buffer.trim());
    }

    buffer = "<";
    insideTag = true;
    continue;
  }

  if (char === ">" && insideTag) {
    buffer += ">";
    chunks.push(buffer);

    buffer = "";
    insideTag = false;
    continue;
  }

  if (char === " " && !insideTag) {
    if (buffer) {
      chunks.push(buffer);
      buffer = "";
    }

    continue;
  }

  buffer += char;
}

if (buffer.trim()) {
  chunks.push(buffer.trim());
}

console.log(chunks);
