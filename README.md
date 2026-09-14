<img width="1633" height="584" alt="Untitled" src="https://github.com/user-attachments/assets/c3dd414f-7765-4637-b612-d0cf5fe0d451" /><br>

<div align="center">
  

<a href="https://github.com/AzureNightlock"><img alt="Made by AzureNightlock" src="https://img.shields.io/badge/MADE%20BY-AzureNightlock-875fff.svg?style=for-the-badge&logo=github&labelColor=000000"></a>&nbsp;&nbsp;
<a href="https://www.npmjs.com/package/@azurenightlock/raven"><img alt="NPM version" src="https://img.shields.io/badge/NPM-v0.3.3-875fff.svg?style=for-the-badge&logo=npm&labelColor=000000"></a>&nbsp;&nbsp;
<a href="https://github.com/AzureNightlock/raven"><img alt="License" src="https://img.shields.io/badge/LICENSE-Apache 2.0-875fff.svg?style=for-the-badge&labelColor=000000"></a>&nbsp;&nbsp;
<a href="https://github.com/AzureNightlock/raven"><img alt="Repository views" src="https://hits.sh/github.com/AzureNightlock/raven.svg?style=for-the-badge&label=VIEWS&color=875fff&labelColor=000000"></a>

</div>

# Raven


Raven is a small framework for building dashboards, pages, and other browser interfaces with a simple custom syntax.

It compiles Raven source files into plain HTML, CSS, and JavaScript. You can open, inspect, debug, and change the generated code.

> [!WARNING]
> Raven is still a work in progress. Expect bugs, missing features, and breaking changes.

## Installation

Do not use:

> [!CAUTION]
> ```
> npm install @azurenightlock/raven
> ```

Raven is a command-line tool, so install it globally:

```bash
npm install -g @azurenightlock/raven
```

A local installation will not make the `raven` command available everywhere on your system.

## Why use Raven?
* Syntax is easy to read and write and is similar to actual coding.
* Projects are very organised due to the fixed folder structure.
* Generated outputs are understandable and debugging is incredibly easy.
* Error outputs are clean and clear
* Has 0 dependencies. So no package-lock.json, 1000+ node_modules, no supply-chain attacks

## Commands

Initialise the project:
```bash
raven init
```

Compile the current project:

```bash
raven compile
```

Lint Raven source files:

```bash
raven lint
```

Format Raven source files:

```bash
raven format
```

Open the Raven documentation:

```bash
raven docs
```

## Output

Raven generates regular web files rather than a framework-specific runtime.

```text
output/
├── index.html
├── style.css
└── script.js
```

You can inspect the generated files, edit them manually, host them anywhere, or use them without Raven afterward.

## Project status

Raven is currently in early development.

The language, command-line interface, compiler behaviour, and generated output may change between versions. It is suitable for experimenting and building small projects, but it is not yet recommended for production use.

## License

Raven is released under the Apache-2.0 License.

<img
  src="https://capsule-render.vercel.app/api?type=waving&color=000000&height=140&section=footer"
  alt="footer"
  style="width: 100%; max-width: 1200px;"
/>
