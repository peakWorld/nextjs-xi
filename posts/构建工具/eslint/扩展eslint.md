# 扩展eslint
https://zh-hans.eslint.org/docs/latest/extend/ways-to-extend

## 插件
在项目中添加属于自己的ESLint**自定义规则**和**自定义处理器**。

* 插件名
- 以 eslint-plugin-<plugin-name> npm模块
- 以 @<scope>/eslint-plugin-<plugin-name> 范围包

## 共享配置
对ESLint配置的预定义，可以在自己的项目中使用。任何可以放在配置文件中的配置都可以放在可共享配置中。

## 格式化工具
让ESLint检查结果并以定义的格式输出结果。自定义格式器能以最适合自己需要的格式显示检查结果，无论是特定的文件格式、特定的显示风格，还是为特定工具优化的格式。

## 解析器
让ESLint支持检查新的语言特性或代码中自定义格式的方法, 将代码转换为ESLint可以对其进行分析和检查的抽象语法树 (AST)。

# 集成Node.js API
https://zh-hans.eslint.org/docs/latest/integrate/integration-tutorial
