/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  return {
    postcssPlugin: "plugin1",
    Declaration: {
      color: (decl) => {
        console.log(decl.toString());
        decl.value = "red";
      },
    },
    Rule(rule) {
      console.log(rule.toString());
    },
    AtRule: {
      media: (atRule) => {
        // All @media at-rules
      },
    },
  };
};

module.exports.postcss = true;
