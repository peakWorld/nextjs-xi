const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "glsl"],

  webpack(config) {
    config.module.rules.push({ test: /\.glsl$/, use: "raw-loader" });
    return config;
  },
};

module.exports = nextConfig;
