#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { generateSetup } from "../generator/setup.js";
import { purple, deepPurple, aka, bold, dim } from "./style.js";
import { commands } from "../language/types.js";
import { getVersion } from "./utils.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const command = process.argv[2];
const version = getVersion(currentDirectory);

if (!commands.has(command)) {
  console.error(
    `${aka(bold("✕ unknown command"))} ${aka(command ?? "<none>")}\n` +
      `  ${dim("expected:")} ${[...commands].map(purple).join(dim(" | "))}`,
  );

  process.exit(1);
}

console.log(`${purple("raven")} ${dim(`v${version}`)}`);
console.log(`${purple("raven")} ${dim("›")} ${bold(deepPurple(command))}`);

if (command === "compile") {
  const entryFile = path.join(currentDirectory, "../entry.js");

  const result = spawnSync(process.execPath, [entryFile], {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  if (result.error) {
    console.error(`${aka(bold("Error"))} ${dim("could not start compiler")}`);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

if (command === "init") {
  try {
    const result = generateSetup();

    if (result.srcCreated && result.pageCreated) {
      console.log(`${purple("✓")} ${bold("Created src directory")}`);
      console.log(`${purple("✓")} ${bold("Created src/page.rvn")}`);
    } else if (!result.srcCreated && result.pageCreated) {
      console.log(`${dim("•")} ${dim("src directory already exists")}`);
      console.log(`${purple("✓")} ${bold("Created src/page.rvn")}`);
    } else {
      console.log(`${dim("•")} ${dim("src directory already exists")}`);
      console.log(`${dim("•")} ${dim("src/page.rvn already exists")}`);
      console.log(`${purple("✓")} ${bold("Project is already set up")}`);
    }
  } catch (error) {
    console.error(`${aka(bold("✕ setup failed"))} ${dim(error.message)}`);
    process.exit(1);
  }
}
