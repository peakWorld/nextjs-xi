Content Types
每种内容类型都有一个关联的“加载器”，告诉esbuild如何解释文件内容。

# JavaScript
默认对 .js、.cjs 和 .mjs 文件启用; .cjs扩展名是node用于CommonJS模块，.mjs扩展名是node用于ECMAScript模块。

注: esbuild支持所有现代JavaScript语法。默认情况下，esbuild的输出将利用所有现代JS功能; 然而，较新的语法可能不受较旧浏览器的支持，因此要配置target选项.

## JavaScript caveats

* ES5 is not supported well
不支持将ES6+语法转换为 ES5。

* Private member performance
私有成员（针对 #name 语法）使用 WeakMap 和 WeakSet 来保留此功能的隐私属性。在此语法转换的情况下, 创建许多具有私有字段或私有方法的类实例可能会给垃圾回收器带来很多开销。
[issue](https://github.com/tc39/ecma262/issues/1657#issuecomment-518916579)

* Imports follow ECMAScript module behavior
在导入需要全局状态的模块之前修改全局状态，是行不通的。因为esbuild实际上会将所有导入语句“提升”到文件的顶部。

* Avoid direct eval when bundling
- 打包器执行“范围提升”的优化: 将所有模块文件合并到一个文件中，并重命名变量以避免名称冲突。这意味着直接eval计算的代码可以读取和写入合并文件中任何变量！
- 取消优化: 对包含调用直接eval的所有范围内的代码;
- 无法重命名变量: 直接eval的代码可能需要通过名称引用任何变量，这意味着它无法重命名变量以避免与捆绑包中其他变量的名称冲突。

* The default export can be error-prone

# TypeScript

# JSX

# 