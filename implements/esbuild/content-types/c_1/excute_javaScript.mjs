import * as esbuild from "esbuild";

const result = await esbuild.build({
  entryPoints: ["./app/index.js"],
  outbase: "app",
  outdir: "dist",
  logLevel: "info",

  bundle: true,
  treeShaking: false,

  // target: ["es6"],
});
