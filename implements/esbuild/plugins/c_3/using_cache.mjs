import esbuild from "esbuild";
import fs from "node:fs";

let examplePlugin = {
  name: "example",
  setup(build) {
    let cache = new Map();

    build.onLoad({ filter: /\.txt$/ }, async (args) => {
      let input = await fs.promises.readFile(args.path, "utf8");
      let key = args.path;
      let value = cache.get(key);

      if (!value || value.input !== input) {
        value = { input };
        cache.set(key, value);
      }

      return value.output;
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
