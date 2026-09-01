import fs from "fs";
import path from "path";

export function generateSetup() {
  const srcDirectory = path.join(process.cwd(), "src");
  const pageFile = path.join(srcDirectory, "page.rvn");

  if (fs.existsSync(pageFile)) {
    return {
      srcCreated: false,
      pageCreated: false,
    };
  }

  if (fs.existsSync(srcDirectory)) {
    fs.writeFileSync(pageFile, "", "utf8");

    return {
      srcCreated: false,
      pageCreated: true,
    };
  }

  fs.mkdirSync(srcDirectory, { recursive: true });
  fs.writeFileSync(pageFile, "", "utf8");

  return {
    srcCreated: true,
    pageCreated: true,
  };
}
