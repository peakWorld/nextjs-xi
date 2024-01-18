import type { PluginCreator, ProcessOptions } from "postcss";

const plugin: PluginCreator<ProcessOptions> = () => ({
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
    media: () => {
      // All @media at-rules
    },
  },
});
plugin.postcss = true;

export default plugin;
