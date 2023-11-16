import esbuild from "esbuild";
import path from "path";

let example1 = {
  name: "example1",
  setup(build) {
    // 改组建中导入路径images 未解析
    build.onResolve({ filter: /^images\// }, (args) => {
      console.log("example1 onResolve images 1");
    });

    build.onResolve({ filter: /^images\// }, (args) => {
      console.log("example1 onResolve images 2");
    });
  },
};

let example2 = {
  name: "example2",
  setup(build) {
    build.onResolve({ filter: /^images\// }, (args) => {
      console.log("example2 onResolve images 1");
    });

    // 此onResolve函数前都未解析 ^images 导入路径, 在该函数处才真正处理
    build.onResolve({ filter: /^images\// }, (args) => {
      console.log("example2 onResolve images 2");
      return {
        path: path.join(args.resolveDir, "assets", args.path),
      };
    });

    // 已经解析了 ^images 导入路径, 则不会再执行后续的onResolve回调
    build.onResolve({ filter: /^images\// }, (args) => {
      console.log("example2 onResolve images 3");
    });
  },
};

await esbuild.build({
  entryPoints: ["./app/moduleA.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [example1, example2],
  loader: { ".png": "file" },
});
