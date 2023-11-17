import esbuild from "esbuild";

let example1 = {
  name: "example1",
  setup(build) {
    const options = build.initialOptions;
    options.define = options.define || {};
    options.define["process.env.NODE_ENV"] = options.minify
      ? '"production"'
      : '"development"';
    console.log("example1 options", options);

    build.onStart(() => {
      console.log("example1 build started");
    });
    build.onEnd((result) => {
      console.log("example1 build ended", result);
    });

    build.onDispose(() => {
      console.log("This plugin is no longer used");
    });
  },
};

let example2 = {
  name: "example2",
  setup(build) {
    const options = build.initialOptions;
    console.log("example2 options", options);

    build.onStart(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("example2 build started");
    });

    build.onEnd(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("example2 build ended");
    });
  },
};

let example3 = {
  name: "example3",
  setup(build) {
    const options = build.initialOptions;
    console.log("example3 options", options);

    build.onStart(async () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 3000);
      }).then(() => console.log("example3 build started"));
    });
  },
};

await esbuild.build({
  entryPoints: ["./app/index.js"],
  outbase: "app",
  outdir: "dist",
  treeShaking: false,

  bundle: true,
  plugins: [example1, example2, example3],
});
