import * as esbuild from "esbuild";
import https from "node:https";
import http from "node:http";

let httpPlugin = {
  name: "http",
  setup(build) {
    build.onResolve({ filter: /^https?:\/\// }, (args) => {
      console.log("onResolve", args);
      return {
        path: args.path,
        namespace: "http-url",
      };
    });

    build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => {
      return {
        path: new URL(args.path, args.importer).toString(),
        namespace: "http-url",
      };
    });

    build.onLoad({ filter: /.*/, namespace: "http-url" }, async (args) => {
      let contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading: ${url}`);
          let lib = url.startsWith("https") ? https : http;
          let req = lib
            .get(url, (res) => {
              if ([301, 302, 307].includes(res.statusCode)) {
                fetch(new URL(res.headers.location, url).toString());
                req.abort();
              } else if (res.statusCode === 200) {
                let chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => resolve(Buffer.concat(chunks)));
              } else {
                reject(
                  new Error(`GET ${url} failed: status ${res.statusCode}`)
                );
              }
            })
            .on("error", reject);
        }
        fetch(args.path);
      });
      return { contents };
    });
  },
};

await esbuild.build({
  entryPoints: ["./app/http.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [httpPlugin],
});
