const postcss = require("postcss");

module.exports = function parse(css, opts) {
  const root = postcss.root();
  // Add other nodes to root
  return root;
};
