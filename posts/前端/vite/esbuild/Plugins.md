# 插件
[已存在插件](https://github.com/esbuild/community-plugins)

## Using plugins [p1_1]
- 插件是一个带有 aname 和 setup 函数的对象。它们以数组形式传递给生成 API 调用。
- 每个build API 调用运行一次setup函数

## Concepts

* Namespaces
- 每个模块都有一个关联的命名空间。默认情况下，esbuild 在命名空间(对应文件系统上的文件)中运行。但 esbuild 也可以处理在文件系统上没有相应位置的“虚拟”模块。
- 插件可用于创建虚拟模块。虚拟模块通常使用命名空间，而不是将它们与文件系统模块区分开来。

* Filters
- 每个回调都必须提供正则表达式作为过滤器。跳过不匹配的路径, 提高性能。
- 尽可能尝试使用过滤器正则表达式，而不是使用 JavaScript 代码进行过滤。
- 允许Go的正则表达式语法.
- 命名空间也可用于筛选。回调必须提供过滤器正则表达式，但也可以选择提供命名空间以进一步限制匹配的路径。

## On-resolve callbacks [p2_1]
- 使用onResolve添加的回调将在esbuild构建的每个模块的每个导入路径上运行; 回调可以自定义esbuild如何进行路径解析。
- 回调函数可以在不返回路径的情况下，将路径解析的责任传递给下一个回调函数。对于给定的导入路径，所有插件中的所有onResolve回调函数将按照它们注册的顺序运行，直到其中一个负责路径解析。如果没有回调函数返回路径，esbuild将运行其默认的路径解析逻辑。

### On-resolve options
* filter
每个回调都必须提供一个过滤器(正则表达式)。当路径与此筛选器不匹配时，将跳过已注册的回调。
* namespace
可选. 如果提供、只会在提供的命名空间中模块内的路径上运行。

### On-resolve arguments
回调函数参数。
* path
底层模块源代码的未解析路径; 默认行为导入路径为相对路径或包名，但插件可以用来引入新的路径形式(https等)。
* importer
包含要解析导入的模块的路径。只有在命名空间为file时，此路径才保证是文件系统路径。
* namespace
包含要解析导入的模块的命名空间，由加载此文件的on-load回调设置; 默认行为加载的模块，默认命名空间为 file。
* resolveDir
将导入路径解析为文件系统上的实际路径时要使用的文件系统目录。
- 对于文件命名空间的模块，默认值为模块所在的目录。
- 对于虚拟模块，默认值为空，但on-load回调也可以为虚拟模块提供解析目录。
* kind
说明了要解析的路径是如何被导入的。
> 'entry-point','import-statement','require-call','dynamic-import','require-resolve','import-rule','composes-from','url-token'
* pluginData
从上一个插件传递的

### On-resolve results
回调函数返回的对象，以提供自定义路径解析; 如果返回undefined, 则返回默认值。

* path
值为非空字符串, 则将导入解析为特定路径。
- 如果有设置，对于该模块的这个导入路径，不会再运行更多的on-resolve回调。
- 如果没有设置，将继续运行在当前回调之后注册的on-resolve回调; 然后，如果路径仍未解析，将默认为相对于当前模块的解析目录解析路径。
* external
将模块标记为外部模块。意味着它不会包含在捆绑包中，而是在运行时导入。
* namespace
与已解析路径关联的命名空间。
- 如果留空，对于非外部路径，默认为文件命名空间。文件命名空间中的路径必须是当前文件系统的绝对路径。
- 如果要解析不是文件系统路径的路径，应将命名空间设置为除文件或空字符串之外的其他内容(告诉esbuild不要将路径视为文件系统上的某个内容)。
* errors and warnings
允许将路径解析过程中生成的任何日志消息传递给esbuild; 在当前日志级别下在终端中显示，并最终出现在最终构建结果中。
- 如果只返回一个错误，不必通过 errors 传递它。可以简单地在 JavaScript 中抛出错误。
```js
warnings: [
  {
    text: "hello world!!",
    location: { file: args.importer, namespace: args.namespace }
  },
]
```
* pluginName
允许将此插件的名称替换为此路径解析操作的其他名称。??
* pluginData
将传递给插件链中运行的下一个插件。
- 如果从 onLoad 插件返回它，它将传递给该文件中的任何导入的 onResolve 插件
- 如果从 onResolve 插件返回它，一个任意的 onLoad 插件将在加载文件时传递给它
* sideEffects
此属性设置为false, 则告诉esbuild，如果导入的名称未使用，则可以删除此导入。
* suffix
传递一个可选的URL query或hash附加到路径中，但不包含在路径本身中。
- 必须以 ? 或 # 开头，因为旨在用作 URL 查询或哈希。
- esbuild将namespace、path和suffix组合视为唯一的模块标识符，因此通过为相同的路径返回不同的后缀，告诉esbuild创建模块的另一个副本。
* watchFiles and watchDirs [p2_2]
允许为watch模式返回额外的文件系统路径以进行扫描。
- 默认情况下，esbuild仅扫描提供给onLoad插件的路径，且在命名空间为file时才扫描。如果插件需要对文件系统中的其他更改做出反应，需要使用这些属性中的一个。
- 如果自上次构建以来 watchFiles 数组中的任何文件发生更改(可能会检查文件内容和/或文件的元数据)，将触发重建。
- 如果自上次构建以来 watchDirs 数组中的任何目录的目录条目列表发生更改，将触发重建。注意, 这并不检查这些目录中任何文件的内容，也不检查任何子目录。

## On-load callbacks
- 使用onLoad添加的回调将针对每个未标记为外部(external)的唯一路径/命名空间运行。它的任务是返回模块的内容，并告诉esbuild如何解释它。
- 回调可以不返回模块内容。在这种情况下，加载模块的责任将传递给下一个注册的回调。对于给定的模块，所有插件中的所有onLoad回调将按照它们注册的顺序运行，直到其中一个负责加载模块。如果没有回调返回模块的内容，esbuild 将运行其默认的模块加载逻辑。

### On-load options
* filter
每个回调都必须提供一个过滤器(正则表达式)。当路径与此筛选器不匹配时，将跳过已注册的回调。
* namespace
可选. 如果提供、只会在提供的命名空间中模块内的路径上运行。

### On-load arguments
* path
