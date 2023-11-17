import esbuild from "esbuild";
import fs from "fs";
import path from "path";

let example1 = {
  name: "example1",
  setup(build) {
    // 将导入路径 转换成 系统文件路径 (文件命名空间)
    build.onResolve({ filter: /^data/ }, (args) => {
      console.log("onResolve ", args);
      return {
        path: path.join(
          "/Users/windlliu/twk/nextjs-xi/implements/esbuild/plugins/c_2/app",
          args.path
        ),
      };
    });

    // 根据系统文件路径 加载文件内容 (文件命名空间)
    build.onLoad({ filter: /sample$/ }, (args) => {
      console.log("onload ", args);
      const contents = fs.readFileSync(args.path);
      return { contents, pluginData: "sample" };
    });

    // 1. onResolve 解析导入路径"data/ex_1.sample", 转换成系统文件路径
    // 2. onLoad 根据系统文件路径, 加载ex_1.sample文件内容 (并且传入pluginData)

    // 3. 在ex_1.sample文件(模块)中, 有新的导入路径
    // 4. 再次触发了 onResolve, 需要解析路径 "data/ex_2.sample", 转换成系统文件路径; 此时有pluginData
    // 5. 再次触发了 onLoad, 加载ex_2.sample文件内容
  },
};

await esbuild.build({
  entryPoints: ["./app/p_data.js"],
  outbase: "app",
  outdir: "dist",

  treeShaking: false,
  bundle: true,
  plugins: [example1],
});
