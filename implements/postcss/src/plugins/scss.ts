import type { PluginCreator, ProcessOptions } from "postcss";

const plugin: PluginCreator<ProcessOptions> = () => ({
  postcssPlugin: "postcss-scss",
  Once() {},
});
plugin.postcss = true;

export default plugin;
