import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { deepPurple, bold, dim } from "../../utils/style.js";

const hostname = "127.0.0.1";
const port = 3000;

const outputDir = path.resolve("output");
const htmlPath = path.join(outputDir, "index.html");
const javascriptPath = path.join(outputDir, "script.js");

const pages = new Set();

const RELOAD_SCRIPT = `
<!-- Code injected by Raven ;) -->
<script>
  new EventSource("/__raven_reload").onmessage = () => location.reload();
</script>
<!-- so ignore this guy -->
`;

function handleEvents(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });

  pages.add(res);
  req.on("close", () => pages.delete(res));
}

export function reloadBrowser() {
  for (const page of pages) {
    page.write("data: reload\n\n");
  }
}

export function startServer({ hotReload = false }) {
  if (!fs.existsSync(htmlPath)) {
    console.error(
      `${aka(bold("✕ nothing to run"))}\n` +
        `  ${dim("no compiled output found in")} ${deepPurple(process.cwd())}\n` +
        `  ${dim("run")} ${deepPurple(bold("raven compile"))} ${dim("first")}`,
    );

    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    switch (req.url) {
      case "/": {
        const html = fs.readFileSync(htmlPath, "utf8");

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
          hotReload ? html.replace("</body>", `${RELOAD_SCRIPT}</body>`) : html,
        );
        return;
      }

      case "/script.js":
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/javascript");
        res.end(fs.readFileSync(javascriptPath));
        return;

      case "/favicon.ico":
        res.statusCode = 204;
        res.end();
        return;

      case "/__raven_reload":
        if (!hotReload) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }

        handleEvents(req, res);
        return;

      default:
        res.statusCode = 404;
        res.end("Not found");
    }
  });

  server.listen(port, hostname, () => {
    const url = `http://${hostname}:${port}/`;

    console.log(
      `${deepPurple(bold("raven"))} ${bold("server running:")}\n` +
        `${dim("· local:")} ${deepPurple(url)}\n` +
        `${dim("· press")} ${bold("CTRL+C")} ${dim("to stop")}\n`,
    );
  });
}
