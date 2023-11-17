import esbuild from "esbuild";
import path from "path";

let watchPlugin = {
  name: "watchPlugin",
  setup(build) {
    build.onResolve({ filter: /^watch\// }, (args) => {
      const url = path.join(args.resolveDir, `${args.path}.js`);
      console.log("watchPlugin", args, url);
      return {
        path: url,

        // 在watch模式下, watch/a.js文件内容的改变不会触发重新构建
        // 添加如下配置, 此时watch/a.js内容的改动会触发重新构建
        // watchFiles: [path.join(args.resolveDir, `watch/a.js`)],
      };
    });
  },
};

const ctx = await esbuild.context({
  entryPoints: ["./app/p_watch.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [watchPlugin],
});

await ctx.watch();
