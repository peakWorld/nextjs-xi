import type { PluginCreator, ProcessOptions } from "postcss";

function PostPluginLess() {
  const plugin: PluginCreator<ProcessOptions> = () => ({
    postcssPlugin: "${pluginName}",
    // 使用运行时定义的侦听器, 在侦听器之间重用一些数据
    prepare(result) {
      const variables = {} as any;
      return {
        Declaration(node) {
          if (node.variable) {
            variables[node.prop] = node.value;
          }
        },
        OnceExit() {
          console.log(variables);
        },
      };
    },
    Once(root) {
      // Calls once per file, since every file has single Root
    },
    Declaration: {
      color: (decl) => {
        // All `color` declarations
      },
      "*": (decl) => {
        // All declarations
      },
    },
    AtRule: {
      media: (atRule) => {
        // All @media at-rules
      },
    },
  });
  plugin.postcss = true;
  return plugin;
}

export default PostPluginLess;
