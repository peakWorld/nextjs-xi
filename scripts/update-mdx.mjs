import fs from "fs-extra";
import { execSync } from "child_process";
import crypto from "crypto";

const lines = execSync(
  // "git diff --staged --diff-filter=ACMR --name-only -z"
  "git status -s -z"
).toString();
const stagedFiles = lines.split("\u0000");

const settingFile = "./posts/settings.json";
fs.ensureFileSync(settingFile);
const settings =
  fs.readJSONSync(settingFile, { encoding: "utf-8", throws: false }) ?? {};

const AFiles = [];
const DFiles = [];

stagedFiles.forEach((file) => {
  if (!file.includes("posts/")) return;

  if (/^(AM?|MA)/.test(file)) {
    AFiles.push(file.split(/\s+/)[1]);
  }

  if (/^D/.test(file)) {
    DFiles.push(file.split(/\s+/)[1]);
  }
});

if (DFiles.length) {
  DFiles.forEach((file) => {
    const md5 = cryptPwd(file);
    delete settings[md5];
  });
}

if (AFiles.length) {
  AFiles.forEach((file) => {
    const md5 = cryptPwd(file);
    settings[md5] = file;
  });
}

function cryptPwd(text) {
  var md5 = crypto.createHash("md5");
  return md5.update(text).digest("hex");
}

fs.writeJsonSync(settingFile, settings, { spaces: 2, encoding: "utf-8" });

execSync(`git add ${settingFile}`);
