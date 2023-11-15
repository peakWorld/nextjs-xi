import esbuild from "esbuild";
import fs from "node:fs";

let exampleOnLoadPlugin = {
  name: "example",
  setup(build) {
    build.onLoad({ filter: /\.txt$/ }, async (args) => {
      console.log("args", args);
      let text = await fs.promises.readFile(args.path, "utf8");
      return {
        contents: JSON.stringify(text.split(/\s+/)),
        loader: "json",
      };
    });
  },
};

await esbuild.build({
  entryPoints: ["./app/index.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [exampleOnLoadPlugin],
});
