import fs from "fs";
import path from "node:path";
import { dim, green, aka } from "./style.js";

export function getVersion(cwd) {
  try {
    const packagePath = path.join(cwd, "../../package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    return packageJson.version;
  } catch (err) {
    console.error(err);
    return "0.0.0";
  }
}

export function printStage(
  label,
  run,
  currentStage,
  totalStage,
  labelWidth = 24,
) {
  process.stdout.write(
    `${dim(`[${currentStage}/${totalStage}]`)} ${label.padEnd(labelWidth)}`,
  );

  try {
    const result = run();
    process.stdout.write(`${green("done")}\n`);
    return result;
  } catch (error) {
    process.stdout.write(`${aka("fail")}\n`);
    throw error;
  }
}

export function getFileSizes(filePaths) {
  return filePaths.map((file) => {
    const filePath = path.resolve(file);
    try {
      const stats = fs.statSync(filePath);
      return { file, size: stats.size };
    } catch (err) {
      console.error(err);
      return { file, size: null };
    }
  });
}
