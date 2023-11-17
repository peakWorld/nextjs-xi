import * as esbuild from "esbuild";
// import * as svelte from "svelte/compiler";
import path from "node:path";
import fs from "node:fs";

let sveltePlugin = {
  name: "svelte",
  setup(build) {
    build.onLoad({ filter: /\.svelte$/ }, async (args) => {
      let convertMessage = ({ message, start, end }) => {
        let location;
        if (start && end) {
          let lineText = source.split(/\r\n|\r|\n/g)[start.line - 1];
          let lineEnd = start.line === end.line ? end.column : lineText.length;
          location = {
            file: filename,
            line: start.line,
            column: start.column,
            length: lineEnd - start.column,
            lineText,
          };
        }
        return { text: message, location };
      };

      let source = await fs.promises.readFile(args.path, "utf8");
      let filename = path.relative(process.cwd(), args.path);

      try {
        // let { js, warnings } = svelte.compile(source, { filename });
        let contents = js.code + `//# sourceMappingURL=` + js.map.toUrl();
        return { contents, warnings: warnings.map(convertMessage) };
      } catch (e) {
        return { errors: [convertMessage(e)] };
      }
    });
  },
};

await esbuild.build({
  entryPoints: ["./app/svelte.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [sveltePlugin],
});
