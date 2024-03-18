import path from "node:path";
import child_process from "node:child_process";
import postcss from "postcss";
import fs from "fs-extra";
import less from "postcss-less";
import scss from "postcss-scss";
import plugin1 from "./plugins/plugin1";
import pluginLess from "./plugins/less";
import pluginScss from "./plugins/scss";

const env = process.env.NODE_ENV;
const bins = path.join(process.cwd(), "./node_modules/.bin");

// 删除less中ast非必要属性
function deleteAstProp(node: any, ast: any) {
  const {
    // raws,
    source,
    parent,
    inputs,
    proxyCache,
    lastEach,
    indexes,
    ...rest
  } = node;
  if (rest.type === "comment") return;
  ast.nodes.push(rest);
  if (node.nodes) {
    rest.nodes = [];
    node.nodes.forEach((it: any) => deleteAstProp(it, rest));
  }
}

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
  // https://less.bootcss.com/#%E6%A6%82%E8%A7%88
  if (env === "less") {
    const url = path.join(process.cwd(), "./src/less/base.less");
    const source = fs.readFileSync(url).toString();

    const parser = postcss();
    parser.use(pluginLess);
    const result = await parser.process(source, {
      from: undefined,
      syntax: less,
    });

    const ast = { type: "root", nodes: [] };
    result.root.each((node) => deleteAstProp(node, ast));

    // 输出ast树
    fs.writeJsonSync(`${dirUrl}/less.json`, ast, { spaces: 2 });
    // 编译成css
    child_process.exec(`${bins}/lessc ${url} ${dirUrl}/base.css`);
  }

  // scss相关
  // https://www.sass.hk
  if (env === "scss") {
    const url = path.join(process.cwd(), "./src/scss/base.scss");
    const source = fs.readFileSync(url).toString();

    const parser = postcss();
    parser.use(pluginScss);
    const result = await parser.process(source, {
      from: undefined,
      syntax: scss,
    });

    const ast = { type: "root", nodes: [] };
    result.root.each((node) => deleteAstProp(node, ast));

    // 输出ast树
    fs.writeJsonSync(`${dirUrl}/scss.json`, ast, { spaces: 2 });
    // 编译成css
    child_process.exec(`${bins}/sass ${url} ${dirUrl}/base.css --no-source-map`);
  }
})();
