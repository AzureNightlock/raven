import fs from "node:fs";

import { compile } from "../compile/compile.js";
import { reloadBrowser, startServer } from "../run/server.js";

const file = "src/page.rvn";
const debounce = 50;

let pending;

export function startCrun() {
  compile({ logs: false });
  startServer({ hotReload: true });

  fs.watch(file, () => {
    clearTimeout(pending);

    pending = setTimeout(() => {
      compile({ logs: false });
      reloadBrowser();

      console.log("recompiled");
    }, debounce);
  });
}
