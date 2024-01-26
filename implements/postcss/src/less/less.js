// less插件

module.exports = {
  install: function (less, pluginManager, functions) {
    functions.add("pi", function () {
      return Math.floor(Math.PI);
    });
  },
};
