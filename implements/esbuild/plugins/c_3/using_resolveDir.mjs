import esbuild from "esbuild";
import fs from "node:fs";
import path from "path";

const BaseUrl =
  "/Users/windlliu/twk/nextjs-xi/implements/esbuild/plugins/c_3/app/mdx";

let resolveDirPlugin = {
  name: "resolveDirPlugin",
  setup(build) {
    build.onResolve({ filter: /^mdx\// }, (args) => {
      console.log("onResolve", args, path.basename(args.path));
      return {
        path: path.join(args.resolveDir, path.basename(args.path)),
      };
    });

    // 稍微精确匹配
    build.onLoad({ filter: /_ey.mdx$/ }, async (args) => {
      console.log("resolveDirPlugin", args);
      const text = fs.readFileSync(args.path, { encoding: "utf-8" });
      return {
        contents: text,
        resolveDir: BaseUrl,
      };
    });
  },

  // 1. 加载文件(模块) ex_ey.mdx, 返回值包含 contexts 和 resolveDir(BaseUrl)

  // 2. 在模块ex_ey.mdx中 所有导入路径其onResolve回调函数、参数中resolveDir值为BaseUrl
};

await esbuild.build({
  entryPoints: ["./app/resolve.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [resolveDirPlugin],
  loader: {
    ".mdx": "file",
  },
});
