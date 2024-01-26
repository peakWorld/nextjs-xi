import type { PluginCreator, ProcessOptions } from "postcss";

const plugin: PluginCreator<ProcessOptions> = () => ({
  postcssPlugin: "postcss-less",
  AtRule: {
    import(atrule) {
      console.log("import.....", atrule.name);
    },
  },
});
plugin.postcss = true;
export default plugin;
