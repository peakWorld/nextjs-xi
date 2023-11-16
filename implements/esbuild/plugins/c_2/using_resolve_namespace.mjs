import esbuild from "esbuild";
import path from "path";

let example1 = {
  name: "example1",
  setup(build) {
    // esbuild 默认所有文件(模块)处于 file namespace下
    // 虚拟模块 非真实文件, 1.归属到其他的namespace下 2.通过namesapce来过滤

    // 将所有以glsl结尾的导入路径(对应一个模块/[虚拟]文件) 归属到glsl namespace下
    // 只是归属命名空间的(未实现真实的解析)
    build.onResolve({ filter: /glsl$/ }, (args) => {
      console.log("onResolve glsl", args);
      return {
        path: args.path,
        namespace: "glsl",
      };
    });
  },
};

await esbuild.build({
  entryPoints: ["./app/mb.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [example1],
  loader: {
    ".glsl": "file",
  },
});
