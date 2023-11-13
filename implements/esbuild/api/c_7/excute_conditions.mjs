import * as esbuild from "esbuild";

const result = await esbuild.build({
  entryPoints: [
    "./app/conditions/_require.ts",
    "./app/conditions/_import.ts",
    "./app/conditions/es_import.ts",
  ],
  bundle: true,
  outbase: "app",
  outdir: "dist",

  platform: "browser",
  // conditions: ["custom2"],
});

// 新: 配置模块的导出

// case1 包含五种默认的conditions
// 模块导入有两种方式import/require
// import方式 导入 conditions->import 文件
// require方式 导入 conditions->require 文件

// case2 包含三种默认conditions => node/browser/default
// platform: "neutral" 未设置conditions, 两种方式都导入 conditions->default 文件
// platform: "browser" 设置conditions: ["browser"], 两种方式都导入 conditions->browser 文件
// platform: "node" 未设置conditions: ["node"], 两种方式都导入 conditions->node 文件
// 注: package.json中case2的export配置, 其default要放在最后位置

// case3 包含conditions => 默认的default/自定义custom1/custom2
// 注: package.json中case3的export配置顺序[custom1, custom2, default]
// 在build中设置conditions: ["custom2"], 两种方式都导入 conditions->custom2 文件

// 如果某个模块设置了多种export, 可以根据conditions来配置每个export的导出文件。
