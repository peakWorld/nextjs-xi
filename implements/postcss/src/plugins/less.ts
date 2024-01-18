import type { PluginCreator, ProcessOptions } from "postcss";

const plugin: PluginCreator<ProcessOptions> = () => ({
  postcssPlugin: "postcss-less",
  // Declaration(decl, {}) {
  //   if (decl.value.startsWith("")) {
  //     decl.parent?.each((it) => {
  //       if (it.type === "decl") {
  //         console.log("decl", decl.prop, decl.value);
  //       }
  //     });
  //   }
  // },
  AtRule: {
    import(atrule) {
      console.log("import.....");
    },
  },
});
plugin.postcss = true;
export default plugin;
