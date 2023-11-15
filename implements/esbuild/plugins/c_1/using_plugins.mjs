import * as esbuild from "esbuild";

let envPlugin = {
  name: "env",
  setup(build) {
    // 拦截称为“env”的导入路径，以便 esbuild 不尝试将它们映射到文件系统位置。用“env-ns”命名空间标记它们，为此插件保留它们
    build.onResolve({ filter: /^env$/ }, (args) => ({
      path: args.path,
      namespace: "env-ns",
    }));

    // 加载带有“env-ns”命名空间标签的路径，并表现得像它们指向一个包含环境变量的 JSON 文件。
    build.onLoad({ filter: /.*/, namespace: "env-ns" }, () => ({
      contents: JSON.stringify(process.env),
      loader: "json",
    }));
  },
};

await esbuild.build({
  entryPoints: ["./app/index.js"],
  outbase: "app",
  outdir: "dist",
  logLevel: "verbose",

  bundle: true,
  plugins: [envPlugin],
});
