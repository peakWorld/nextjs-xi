import esbuild from "esbuild";
import path from "path";

let exampleOnResolvePlugin = {
  name: "example",
  setup(build) {
    // 路径解析: 以images开头的路径指向 确切的文件路径./assets/images/
    build.onResolve({ filter: /^images\// }, (args) => {
      console.log("images args", args);
      return {
        path: path.join(args.resolveDir, "assets", args.path),
      };
    });

    // 标记以"http://" or "https://"开头的路径为external
    build.onResolve({ filter: /^https?:\/\// }, (args) => {
      console.log("https args", args);
      return { path: args.path, external: true };
    });
  },
};

await esbuild.build({
  entryPoints: ["./app/index.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [exampleOnResolvePlugin],
  loader: { ".png": "file" },
});
