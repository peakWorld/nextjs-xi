import esbuild from "esbuild";
import path from "path";

let examplePlugin = {
  name: "example",
  setup(build) {
    build.onResolve({ filter: /^example$/ }, async (args) => {
      // 1. 在bar目录中解析输入路径, 必须以./开头=> 即"./a,js"
      const result = await build.resolve("./a.js", {
        resolveDir: path.join(args.resolveDir, "./bar"),
        kind: "import-statement",
      });
      if (result.errors.length > 0) {
        return { errors: result.errors };
      }
      return { path: result.path, external: true };
    });
  },
};

await esbuild.build({
  entryPoints: ["./app/index.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [examplePlugin],
});
