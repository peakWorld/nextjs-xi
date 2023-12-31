import fs from "fs-extra";
import { execSync } from "child_process";
import crypto from "crypto";

const isPreCommit = process.argv[2] === "pre-commit";
console.log("isPreCommit", isPreCommit);

const lines = execSync(
  // "git diff --staged --diff-filter=ACMR --name-only -z"
  "git status -s -z"
)
  .toString()
  .trim();
const stagedFiles = lines.match(/[AMRD\s]+([^\sAMRD]*)/g); // 文件夹名字中含有AMRD大写字母会有问题

const settingFile = "./posts/settings.json";
fs.ensureFileSync(settingFile);
const settings =
  fs.readJSONSync(settingFile, { encoding: "utf-8", throws: false }) ?? {};

const AFiles = [];
const DFiles = [];

stagedFiles.forEach((file) => {
  if (
    !file.includes(".md") || // 非.md文件
    !file.includes("posts/") ||
    file.includes("posts/settings.json")
  )
    return;

  const [t, tmp] = file.split(/\s+/);
  console.log(file, "   ", t, "   ", tmp);
  const chunks = tmp.split("\u0000");

  if (!chunks[0]) return;

  if (/^A/.test(t)) {
    AFiles.push(chunks[0]);
  }
  if (/^D/.test(file)) {
    DFiles.push(chunks[0]);
  }
  if (/^R/.test(file)) {
    AFiles.push(chunks[0]);
    DFiles.push(chunks[1]);
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

// console.log("settings", stagedFiles, AFiles, DFiles);

fs.writeJsonSync(settingFile, settings, { spaces: 2, encoding: "utf-8" });

execSync(`git add ${settingFile}`);
