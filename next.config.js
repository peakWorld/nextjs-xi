const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "fs", "vs"],

  webpack(config) {
    config.module.rules.push({ test: /\.(v|f)s$/, use: "raw-loader" });
    return config;
  },
};

module.exports = nextConfig;
