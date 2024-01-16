const path = require("node:path");
const child_process = require("node:child_process");
const postcss = require("postcss");
const fs = require("fs-extra");
const less = require("postcss-less");
const scss = require("postcss-scss");
const plugin1 = require("./plugins/plugin1");

const env = process.env.NODE_ENV;
const bins = path.join(process.cwd(), "./node_modules/.bin");

(async () => {
  // 插件会重新访问更改或添加的所有节点
  if (env === "plugin") {
    // 方式一
    await postcss([plugin1]).process("a { color: black }", { from: undefined });
    // 方式二
    // const parser = postcss();
    // parser.use(plugin1);
    // await parser.process("a { color: black }", { from: undefined });
  }

  const dirUrl = path.join(process.cwd(), `./.tmp`);
  fs.ensureDirSync(dirUrl);

  // less相关
  if (env === "less") {
    const url = path.join(process.cwd(), "./src/less/base.less");
    const source = fs.readFileSync(url).toString();

    const parser = postcss();
    const result = await parser.process(source, {
      from: undefined,
      syntax: less,
    });

    fs.writeJsonSync(`${dirUrl}/less.json`, result.root); // 输出ast树
    child_process.exec(`${bins}/lessc ${url} ${dirUrl}/base.css`); // 编译成css
  }

  if (env === "scss") {
    const url = path.join(process.cwd(), "./src/scss/base.less");
    const source = fs.readFileSync(url).toString();

    const parser = postcss();
    const result = await parser.process(source, {
      from: undefined,
      syntax: scss,
    });

    fs.writeJsonSync(`${dirUrl}/less.json`, result.root);
  }
})();
