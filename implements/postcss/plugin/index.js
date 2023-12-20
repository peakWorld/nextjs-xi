const postcss = require("postcss");
const plugin1 = require("./plugin1");

(async () => {
  // 1. 插件会重新访问更改或添加的所有节点
  await postcss([plugin1]).process("a { color: black }", { from: undefined });
})();
