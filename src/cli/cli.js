#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateSetup } from "../generator/setup.js";
import { deepPurple, aka, bold, dim } from "./utils/style.js";
import { commands } from "../language/types.js";
import { getVersion } from "./utils/utils.js";
import { startServer } from "./commands/run/server.js";
import { startCrun } from "./commands/crun/crun.js";
import { compile } from "./commands/compile/compile.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const command = process.argv[2];
const version = getVersion(currentDirectory);

if (!commands.has(command)) {
  console.error(
    `${aka(bold("✕ unknown command"))} ${aka(command ?? "<none>")}\n` +
      `  expected commands like ${deepPurple("run")} or ${deepPurple("compile")}`,
  );
  console.error(`Type "raven list" to list all the commands`)

  process.exit(1);
}

console.log(`${deepPurple("raven")} ${dim(`v${version}`)}`);
console.log(`${deepPurple("raven")} ${dim("›")} ${bold(deepPurple(command))}`);

if (command === "compile") {
  compile({logs: true})
}

if (command === "init") {
  try {
    const result = generateSetup();

    if (result.srcCreated && result.pageCreated) {
      console.log(`${deepPurple("✓")} ${bold("Created src directory")}`);
      console.log(`${deepPurple("✓")} ${bold("Created src/page.rvn")}`);
    } else if (!result.srcCreated && result.pageCreated) {
      console.log(`${dim("•")} ${dim("src directory already exists")}`);
      console.log(`${deepPurple("✓")} ${bold("Created src/page.rvn")}`);
    } else {
      console.log(`${dim("•")} ${dim("src directory already exists")}`);
      console.log(`${dim("•")} ${dim("src/page.rvn already exists")}`);
      console.log(`${deepPurple("✓")} ${bold("Project is already set up")}`);
    }
  } catch (error) {
    console.error(`${aka(bold("✕ setup failed"))} ${dim(error.message)}`);
    process.exit(1);
  }
}
if (command === "run") {
  startServer()
}

if (command === "crun") {
  startCrun()
}
