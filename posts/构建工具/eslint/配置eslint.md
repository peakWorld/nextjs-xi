# 配置eslint
注: 通过在[npmjs.com](https://www.npmjs.com/search?q=eslint-config)上搜索“eslint-config”并使用别人创建的配置

## 配置文件
使用 JavaScript、JSON 或 YAML 文件指定整个目录及其所有子目录的配置信息。

* 可配置选项
- 环境 - 脚本被设计为在哪些环境下运行。每个环境都会附带一组预设的全局变量。
- 全局变量 - 脚本在执行过程中需要用到的额外全局变量。
- 规则 - 启用了哪些规则，它们又是什么级别错误水平
- 插件 - 第三方插件为 ESLint 定义了额外的规则、环境、配置等。

* 使用配置文件
- 方式一：使用配置文件的方式是使用 .eslintrc.* 和 package.json 文件。ESLint会在检查文件的目录中寻找它们，并在其直系父目录中寻找，直到文件系统的根目录（/）、当前用户的主目录（~/）或指定 root: true 时停止。
- 方式二：把文件保存在你想保存的地方，然后用 --config 选项把它的位置传给 CLI。
```sh
# myconfig.json 指eslint相关配置文件
# myfiletotest.js 指要执行的文件
eslint -c myconfig.json myfiletotest.js
```

* 配置文件中的注释
JSON 和 YAML 配置文件格式都支持注释（package.json 文件中不能使用注释）。ESLint 会安全地忽略了配置文件中的注释。

* 添加共享设置
ESLint 支持在配置文件中添加共享设置。插件使用 settings 来指定在所有规则中共享的信息。ESLint配置文件中的settings对象，将被提供给每个正在执行的规则。
```js
{
  "settings": {
    "sharedData": "Hello"
  }
}
```

* 级联和层次结构
- 如果一个 .eslintrc 文件与被提示的文件在同一目录下，那么该配置将被优先考虑。然后 ESLint 沿着目录结构向上搜索，合并沿途发现的任何 .eslintrc 文件，直到到达 root: true 的 .eslintrc 文件或根目录。
- 如果根目录下有 package.json 文件，而其中又有 eslintConfig 字段，它所描述的配置将适用于它下面的所有子目录，但 子目录下的 .eslintrc 文件所描述的配置将在有冲突的规范时覆盖它。
- 如果在同一目录下有 .eslintrc 和 package.json 文件，.eslintrc 将优先使用，package.json 文件将不被使用。

### 扩展配置文件
配置文件使用扩展后，可以继承另一个配置文件的所有特征（包括规则、插件和语言选项）并修改所有选项。
```js
{
  // 可以省略配置名称中的 eslint-config- 前缀。如 airbnb 会被解析为 eslint-config-airbnb。
  extends: ['airbnb'] // eslint-config-airbnb

  // extends: "eslint:recommended", // 启用报告常见问题的核心规则子集。
  // "extends": "eslint:all", // 不推荐。启用当前安装的 ESLint 版本中的所有核心规则。核心规则的集合会因 ESLint 的任何次要或主要版本改变而改变。
  // extends: ["./node_modules/coding-standard/eslintDefaults.js"], // 使用现有配置文件
}
```

* 使用插件配置
为ESLint添加各种扩展功能的npm包。一个插件可以执行许多功能，包括但不限于添加新的规则和导出可共享的配置。
```js
{
  // 属性值
  // 省略包名中的 eslint-plugin- 前缀。
  "plugins": ["react"],

  // extends 属性值由以下内容组成：
  // plugin:
  // 包名（可以省略其前缀，如 react 是 eslint-plugin-react 的缩写）
  // /
  // 配置名称（如 recommended）
  "extends": ["plugin:react/recommended"],
  "rules": {
    "react/no-set-state": "off"
  }
}

// eslint-plugin-react 插件相关配置
// https://github.com/jsx-eslint/eslint-plugin-react/blob/master/index.js
```

### 基于 glob 模式的配置
在 overrides 键下提供配置，这些配置只会用于符合特定 glob 模式的文件，且使用与在命令行中传递的相同格式。
```js
{
  "overrides": [
    {
      "files": ["bin/*.js", "lib/*.js"],
      "excludedFiles": "*.test.js",
      "rules": {
        "quotes": ["error", "single"]
      }
    }
  ]
}
// 1. 针对相对于配置文件所在目录的文件路径。
// 如果配置文件的路径是 /Users/wk/any-project/.eslintrc.js，而要覆盖的文件的路径是 /Users/wk/any-project/lib/util.js，那么 .eslintrc.js 中提供的模式将针对相对路径 lib/util.js 执行。
// 2. 在同一配置文件中，glob 模式覆盖的优先级高于常规配置。同一个配置文件中的多个覆盖会按顺序应用。也就是说，配置文件中的最后一个覆盖块总是具有最高的优先权。
// 3. overrides覆盖块可以包含任何在常规配置中有效的配置选项，但 root 和 ignorePatterns 除外。
// 4. 在覆盖块中可以提供多个 glob 模式。一个文件必须至少与所提供的模式之一相匹配，才能使用该配置。

// 注：如果配置是通过 --config CLI 选项提供的，配置中的 glob 模式是相对于当前工作目录的，而不是给定配置的基本目录。例如，如果 --config configs/.eslintrc.json，那么配置中的 glob 模式是相对于 . 而不是 ./configs。
```

## 配置语言选项
在js生态中有多个运行时、版本、扩展和框架。每个所支持的语法和全局变量都不尽相同。ESLint会让你指定项目中JavaScript所使用的语言选项。

### 指定环境
环境会提供预设的全局变量。
* browser - 浏览器全局变量。
* node - Node.js 的全局变量和 Node.js 的范围。
* shared-node-browser - Node.js 和浏览器共同的全局变量。
* es* 启用 ECMAScript指定版本的全局变量，并自动设置对应的解析器选项ecmaVersion。

注: 这些环境并不互斥，所以可以一次定义多个环境。

* 使用配置注释
在 JavaScript 文件中使用注释来指定环境
```js
/* eslint-env node, mocha */   // 启用了 Node.js 和 Mocha 环境。
```

* 使用插件中的环境
```js
{
  "plugins": ["example"], // 指定插件的名称
  "env": {
    "example/custom": true // 没有前缀的插件名称，加一个斜线，最后再加上环境名称
  }
}
```

### 指定全局变量
ESLint 的一些核心规则依赖于对代码在运行时可用的全局变量的了解。
由于这些变量在不同的环境中会有很大的不同，而且在运行时也会被修改，因此 ESLint 不会对执行环境中存在的全局变量进行假设。如果想使用需要知道有哪些全局变量的规则，可以在配置文件中定义全局变量，或者在源代码中使用配置注释。

* 使用配置注释
```js
/* global var1, var2 */  // 定义了两个全局变量 var1 和 var2。
/* global var1:writable, var2:writable */ // 指定这些全局变量可以被写入（而不是只能被读取）
```

* 使用配置文件
```js
{
  "globals": {
    "var1": "writable", // "writable" 以允许变量被覆盖。
    "var2": "readonly",  // "readonly" 以禁止覆盖。
    "Promise": "off" // "off" 以禁用全局变量。
  }
}
```

### 指定解析器选项
ESLint 允许指定想要支持的 JavaScript 语言选项。
```js
// 支持 ES6 语法不等于支持新的 ES6 全局变量
{ "parserOptions": { "ecmaVersion": 6 } }  // 启用ES6语法, 但不会自动启用ES6全局变量。

{ "env": { "es6": true } } // 启用ES6全局变量，同时会自动启用ES6语法(因为设置env中es*为true时，会自动设置parserOptions中ecmaVersion属性)
```

* 解析器选项
通过使用 parserOptions 属性设置解析器选项。
- ecmaVersion 指定要使用的ECMAScript语法的版本
```js
// 设置为 2015（6）、2016（7）、2017（8）、2018（9）、2019（10）、2020（11）、2021（12）、2022（13）、2023（14）或 2024（15）来使用基于年份的命名。
// 也可以设置 "latest" 来使用受支持的最新版本。
```
- sourceType - 设置为 "script"（默认值）或 "module"（如果代码是 ECMAScript 模块）。
- ecmaFeatures - 表示想使用哪些额外的语言特性的对象。
```js
{
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true, // 启用 JSX
      "globalReturn": true, // 允许全局范围内的 return 语句
      "impliedStrict": true // 启用全局严格模式（如果 ecmaVersion 是 5 或更高版本）
    }
  },
}
```

## 配置规则
规则是ESLint的核心构建模块。规则验证代码是否符合某个期望，以及如果不符合该期望该怎么做。规则还可以包含针对该规则的额外配置选项。

### 规则严重性
```js
// "off" 或 0 - 关闭规则
// "warn" 或 1 - 启用并视作警告（不影响退出）
// "error" 或 2 - 启用并视作错误（触发时退出代码为 1）

// 通常将规则设置为 "error" 以便在持续集成测试、pre- commit 检查和拉取请求合并中强制遵守规则，而 ESLint 则以非零代码退出。
// 如果不想强制遵守规则但仍想要 ESLint 报告违反规则的情况，则可以将严重等级设置为 "warn"。
```

* 使用配置注释
```js
/* eslint eqeqeq: "off", curly: "error" */  =>  // 关闭 eqeqeq，启用 curly 并视作错误。
/* eslint quotes: ["error", "double"], curly: 2 */  => // 数组中的第一项总是规则的严重程度（数字或字符串）

// 注释描述 必须出现在配置之后，并以两个或多个连续的 - 字符与配置分开。
/* eslint eqeqeq: "off", curly: "error"
    --------
    Here's a description about why this configuration is necessary. */
```

* 使用配置文件
```js
{
  "rules": {
    "eqeqeq": "off",
    "curly": "error",
    "quotes": ["error", "double"]
  }
}
```

### 插件规则
配置定义在插件中的规则
```js
{
  "plugins": ["plugin1"], // 插件名, 省略 eslint-plugin-
  "rules": {
    "quotes": ["error", "double"],
    "plugin1/rule1": "error"  // 插件名和/ : 规则ID
  }
}
```

### 禁用规则
* 使用配置注释
```js
//--------------- 非文件顶部写入块注释, 在文件的一部分中起效
// 禁用全部规则警告
/* eslint-disable */

alert('foo');

/* eslint-enable */

// 禁用或启用特定规则的警告
/* eslint-disable no-alert, no-console */

alert('foo');
console.log('bar');

/* eslint-enable no-alert, no-console */

//---------------- 文件顶部写入块注释, 在整个文件中奇效
// 禁用全部规则警告
/* eslint-disable */
alert('foo');

// 禁用或启用特定规则
/* eslint-disable no-alert */
alert('foo');

//--------------- 要禁用某一特定行的所有规则
alert('foo'); // eslint-disable-line
alert('foo'); // eslint-disable-line no-alert

// eslint-disable-next-line
alert('foo');

// eslint-disable-next-line no-alert
alert('foo');

```

* 使用配置文件
在配置文件中禁用一组文件的规则。
```js
// 使用overrides键和files键 => 禁用相关文件下的规则 no-unused-expressions
{
  "overrides": [
    {
      "files": ["*-test.js","*.spec.js"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ],
  "noInlineConfig": true // 禁用所有内联配置注释
  "reportUnusedDisableDirectives": true // 报告未使用的 eslint-disable 注释
}
```

## 配置插件
用插件以各种不同的方式扩展 ESLint。
* 自定义规则，以验证你的代码是否符合某个期望，以及如果不符合该期望该怎么做。
* 自定义配置。
* 自定义环境。
* 自定义处理器，从其他类型的文件中提取 JavaScript 代码，或在提示前对代码进行预处理。

```js
// 要在配置文件内配置插件，使用plugins键。由插件名称组成的列表，可以省略插件名称中的eslint-plugin-前缀。
{
  "plugins": [
    "plugin1",
    "eslint-plugin-plugin2"
  ]
}

// 1. 插件的解析是相对于配置文件的。换句话说，ESLint将在配置文件中运行require('eslint-plugin-pluginname') 获得的方式加载插件。
// 2. 基本配置中的插件（通过extends设置加载）是相对于派生配置文件的。
// 例如，如果 ./.eslintrc 中有 extends: ["foo"]。而 eslint-config-foo 中有 plugins: ["bar"]，ESLint 会从 ./node_modules/（而不是 ./node_modules/eslint-config-foo/node_modules/）或祖先目录找到 eslint-plugin-bar。因此，解析配置文件和基础配置中的每个插件都是独立的。
```

### 命名规范
非范围包和范围包中都可以省略 eslint-plugin- 前缀
```js
{
  "plugins": [
    "jquery", // 非范围包 eslint-plugin-jquery
    "@jquery/jquery", // 范围包 @jquery/eslint-plugin-jquery
  ]
}
```

### 使用插件
```js
{
  "plugins": [
    "jquery",   // eslint-plugin-jquery
    "@foo/foo", // @foo/eslint-plugin-foo
    "@bar"      // @bar/eslint-plugin
  ],
  "extends": [ // 使用插件配置
    "plugin:@foo/foo/recommended",
    "plugin:@bar/recommended"
  ],
  "rules": { // 使用插件规则
    "jquery/a-rule": "error",
    "@foo/foo/some-rule": "error",
    "@bar/another-rule": "error"
  },
  "env": { // 使用插件环境
    "jquery/jquery": true,
    "@foo/foo/env-foo": true,
    "@bar/env-bar": true,
  }
}
```

### 指定处理器
处理器可以从其他类型的文件中提取 JavaScript 代码，然后让 ESLint 对 JavaScript 代码进行提示，或者处理器可以在预处理中转换 JavaScript 代码以达到某些目的。

* 在配置文件中使用 processor 键指定处理器，用斜线连接插件名称和处理器名称的字符串。
```js
{
  "plugins": ["a-plugin"],
  "processor": "a-plugin/a-processor" // 启用了插件a-plugin提供的处理器 a-processor
}
```

* 为特定类型文件指定处理器，可以一起使用overrides键和processor键。
```js
{
  "plugins": ["a-plugin"],
  "overrides": [
    {
      "files": ["*.md"],
      "processor": "a-plugin/markdown" // 使用处理器 a-plugin/markdown 来处理 *.md 文件。
    },
    {
      "files": ["**/*.md/*.js"], // 禁用 markdown 文件中以 .js 结尾的命名代码块的 strict 规则。
      "rules": {
        "strict": "off"
      }
    }
  ]
}
```

## 配置解析器
使用自定义解析器将 JavaScript 代码转换为 ESLint 可以理解的抽象语法树。
- 默认的解析器 Espree
```js
{
  "parser": "esprima",
}

// 与ESLint兼容的解析器
// Esprima
// @babel/eslint-parser - Babel 解析器的包装以便与 ESLint 兼容。
// @typescript-eslint/parser - 将 TypeScript 转换为与 ESTree 格式兼容的解析器，好可以在 ESLint 中使用。
```

## 忽略文件
让ESLint在检查时忽略明确的文件或目录
- 在配置文件中添加 ignorePatterns。
- 创建包括忽略匹配模式的专用文件（默认为 .eslintignore）。

* ignorePatterns
在配置文件中使用 ignorePatterns 来告诉 ESLint 忽略特定的文件和目录。
```js
{
  "ignorePatterns": ["temp.js", "**/vendor/*.js"],
}
// ignorePatterns 中的 glob 模式是相对于配置文件所在的目录而言的。
// 不能在 overrides 属性中使用 ignorePatterns 属性。
// 在 .eslintignore 中定义的模式优先于配置文件的 ignorePatterns 属性。
```
- 如果glob模式以/开头，该模式是相对于配置文件的基本目录而言的。例如，lib/.eslintrc.json 中的 /foo.js 会匹配 lib/foo.js，而不是匹配lib/subdir/foo.js。
- 如果配置是通过 --config CLI 选项提供的，配置中以/开头的忽略模式是相对于当前工作目录的，而不是给定配置的基本目录。例如，如果使用 --config configs/.eslintrc.json，配置中的忽略模式是基于 . 而不是 ./configs。

* .eslintignore 文件
在项目的根目录下创建.eslintignore文件来告诉ESLint要忽略哪些文件和目录。运行eslint时，每次只能使用一个.eslintignore文件，且仅会使用当前工作目录中的.eslintignore文件。

匹配特性
- 以 # 开头的行被视为注释，不影响忽略模式。
- 路径是相对于当前工作目录的。
- 前面有 ! 的行是否定模式，重新包括被先前模式忽略的模式。
- 忽略模式的行为与 .gitignore 规范一致。

隐含的忽略规则
- 忽略 node_modules/
- 忽略点文件（除了 .eslintrc.*），以及点文件夹和它们的内容

* package.json 中的 eslintIgnore
如果没找到 .eslintignore 文件，也没有指定替代文件，ESLint 将在 package.json 中寻找 eslintIgnore 键获取要忽略检查的文件。
```js
{
  "name": "mypackage",
  "version": "0.0.1",
  "eslintConfig": {
    "env": {
      "browser": true,
      "node": true
    }
  },
  "eslintIgnore": ["hello.js", "world.js"]
}
```

### 替代文件
使用一个不同于当前工作目录中的 .eslintignore 的文件，可以在命令行中使用 --ignore-path 选项来指定它。
```sh
# 指定 --ignore-path 意味着任何现有的 .eslintignore 文件将不会被使用。
eslint --ignore-path .jshintignore file.js
```

