module.exports = function stringify(root, builder) {
  // Some magic
  const string = decl.prop + ":" + decl.value + ";";
  builder(string, decl);
  // Some science
};
