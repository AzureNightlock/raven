# Raven CLI Architecture

The Raven CLI folder is purely for printing outputs, errors and etc on to the terminal.

## `cli.js` (Raven Commands)
`cli.js` acts as the main executable script for the `raven` command. Its primary responsibility is handling raven commands when entered:

* **Command Validation:** It reads the argument provided by the user and checks it against a known set of valid commands. If the command is unrecognized, it throws an error and outputs the available options.

* **CLI Banner:** Upon running a valid command, it fetches the current tool version and prints a formatted header (e.g., `raven vX.X.X › command`).

* **The `compile` Command:** When a user runs `raven compile`, the script spawns a child process. Instead of handling the compilation logic directly, it delegates the work to a separate `entry.js` file. It inherits standard input/output, meaning all terminal output from the compiler streams directly back to the user.

* **The `init` Command:** When a user runs `raven init`, it calls `generateSetup()` to scaffold a new project. Specifically, it ensures a `src` directory and a boilerplate `src/page.rvn` file exist. It provides context-aware feedback depending on whether these files are newly created or already existed.

## `cliUtils.js` (Helper Utilities)
`cliUtils.js` mainly consists of reusable helper functions:

* **`getVersion`**: Returns the version number from the project's `package.json`.

* **`printStage`**: A terminal UI helper that standardizes how multi-step processes are printed to standard output (e.g., formatting step counts like `[1/5]` followed by a `done` or `fail` status) [cite: 2].

* **`getFileSizes`**: Returns the file size in bytes for a given array of files.