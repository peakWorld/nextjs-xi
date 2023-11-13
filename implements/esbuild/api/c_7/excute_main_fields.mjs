import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: [
    "./app/main_fields/_require.ts",
    "./app/main_fields/_import.ts",
    "./app/main_fields/es_import.ts",
  ],
  bundle: true,
  outbase: "app",
  outdir: "dist",

  platform: "neutral",
  mainFields: ["browser", "module", "main"],
});

// 旧: 配置模块的导出

// 每个Platform配置有默认的mainFields值

// 1.将平台设置为"neutral", mainFields = []
// 无法处理

// 2.将平台设置为"node", mainFields = [main,module]
// 读取模块package中 main字段配置的文件

// 3.将平台设置为"browser", mainFields = [browser,module,main]
// 读取模块package中 browser->main字段配置的文件

// 4.自定义mainFields, 此时platform: "neutral"

// 4.1 例如mainFields: ["main", "module"],
// 则读取模块package中main字段配置的文件[首项匹配]

// 4.2 例如mainFields: ["browser", "module", "main"]
// 而模块mainFileds_2的package中未配置browser字段, 则读取module字段配置的文件["依次匹配"]
