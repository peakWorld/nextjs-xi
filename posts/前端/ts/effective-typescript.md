TypeScript编译为另一种高级语言JavaScript; 运行的是JavaScript,而不是TypeScript。
[source code](https://github.com/danvk/effective-typescript)

# Ch-1

## Item-1
* TypeScript是JavaScript的超集。
所有JavaScript程序都已经是TypeScript程序。 TypeScript有自己的一些语法，因此 TypeScript程序通常不是有效的JavaScript程序。

* TypeScript添加了一个类型系统，用于对JavaScript的运行时行为进行建模，并尝试发现会在运行时抛出异常的代码。

## Item-2
TypeScript是一种不同的语言，具体取决于它的配置方式。
* [配置]noImplicitAny 控制变量是否必须具有已知类型。
* [配置]strictNullChecks 控制null和undefined是否为每种类型允许的值。

1. 启用noImplicitAny 除非将JavaScript项目转换为TypeScript。
2. 启用strictNullChecks 以防止“未定义不是对象”类型的运行时错误。
3. 启用strict模式, 获得最彻底的检查。

## Item-3 代码生成与类型无关
tsc(Typescript编译器)做了两件事：
1. 代码转译：将下一代TypeScript/JavaScript转换为可在浏览器中运行的旧版本JavaScript。
2. 类型检测：检查代码是否存在类型错误。

由于执行的是JavaScript，这意味着类型不会影响代码的运行方式。

* [配置]noEmitOnError 控制是否禁用错误输出。
