export function getVersion(cwd) {
  try {
    const packagePath = path.join(cwd, "../package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    return packageJson.version;
  } catch (err) {
    console.error(err);
    return "0.0.0";
  }
}

export function printStage(label, run, currentStage, totalStage, labelWidth=24) {
  process.stdout.write(
    `${dim(`[${currentStage}/${totalStage}]`)} ${label.padEnd(labelWidth)}`,
  );

  try {
    const result = run();
    process.stdout.write(`${green("done")}\n`);
    return result;
  } catch (error) {
    process.stdout.write(`${red("fail")}\n`);
    throw error;
  }
}