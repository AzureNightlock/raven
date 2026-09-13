export function listCommands(commandList) {
  for (const { title, commands } of commandList) {
    console.log(title);

    for (const [index, [name, description]] of commands.entries()) {
      const branch = index === commands.length - 1 ? "└─" : "├─";

      console.log(`${branch} ${name.padEnd(9)} : ${description}`);
    }

    console.log();
  }
}
