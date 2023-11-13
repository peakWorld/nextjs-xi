import * as esbuild from "esbuild";

const result = await esbuild.build({
  entryPoints: ["./app/index.ts"],
  outbase: "app",
  outdir: "dist",
  logLevel: "info",

  bundle: true,
  treeShaking: false,
});
