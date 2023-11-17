# 插件
[已存在插件](https://github.com/esbuild/community-plugins)

## Using plugins [p1_1]
- 插件是一个带有 name 和 setup 函数的对象。它们以数组形式传递给生成 API 调用。
- 每个build API 调用运行一次setup函数

## Concepts

* Namespaces
- 每个模块都有一个关联的命名空间。默认情况下，esbuild 在文件命名空间中操作(对应于文件系统上的文件)。但是esbuild也可以处理没有对应文件系统位置的“虚拟”模块。
- 插件可以用来创建虚拟模块。虚拟模块通常使用除了文件之外的命名空间，以将它们与文件系统模块区分开来。

* Filters
- 每个回调都必须提供正则表达式作为过滤器。跳过不匹配的路径, 提高性能。
- 尽可能尝试使用过滤器正则表达式，而不是使用 JavaScript 代码进行过滤。
- 允许Go的正则表达式语法.
- 命名空间也可用于筛选。回调必须提供过滤器正则表达式，但也可以选择提供命名空间以进一步限制匹配的路径。

## On-resolve callbacks [p2_1]
- 使用onResolve添加的回调将在每个模块的每个导入路径上运行; 回调可以自定义esbuild如何进行路径解析。
- 回调函数可以在不返回路径的情况下，将路径解析的责任传递给下一个回调函数。对于给定的导入路径，所有插件中的所有onResolve回调函数将按照它们注册的顺序运行，直到其中一个负责路径解析。如果没有回调函数返回路径，esbuild将运行其默认的路径解析逻辑。 [p2_2]

### On-resolve options
* filter
每个回调都必须提供一个过滤器(正则表达式)。当路径与此筛选器不匹配时，将跳过已注册的回调。
* namespace
可选. 只会在提供的命名空间中的模块路径上运行。[p2_3]

### On-resolve arguments
回调函数参数。
* path
底层模块源代码的未解析路径; 默认行为导入路径为相对路径或包名，但插件可以用来引入新的路径形式(https等)。
* importer
包含要解析导入的 **模块的路径**。只有在命名空间为file时，此路径才保证是文件系统路径。
* namespace
包含要解析导入的 **模块的命名空间**; 默认行为加载的模块，默认命名空间为 file。
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
将导入解析为特定路径(非空字符串)。
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
* pluginData [p2_4]
将传递给插件链中运行的下一个插件。
- 如果从 onLoad 插件返回它，它将传递给该文件中的任何导入的 onResolve 插件
- 如果从 onResolve 插件返回它，一个任意的 onLoad 插件将在加载文件时传递给它
* sideEffects
此属性设置为false, 则告诉esbuild，如果导入的名称未使用，则可以删除此导入。
* suffix
传递一个可选的URL query或hash附加到路径中，但不包含在路径本身中。
- 必须以 ? 或 # 开头，因为旨在用作 URL 查询或哈希。
- esbuild将namespace、path和suffix组合视为唯一的模块标识符，因此通过为相同的路径返回不同的后缀，告诉esbuild创建模块的另一个副本。
* watchFiles and watchDirs [p2_5]
允许为watch模式返回额外的文件系统路径以进行扫描。
- 默认情况下，esbuild仅扫描提供给onLoad插件的路径，且在命名空间为file时才扫描。如果插件需要对文件系统中的其他更改做出反应，需要使用这些属性中的一个。
- 如果自上次构建以来 watchFiles 数组中的任何文件发生更改(可能会检查文件内容和/或文件的元数据)，将触发重建。
- 如果自上次构建以来 watchDirs 数组中的任何目录的目录条目列表发生更改，将触发重建。注意, 这并不检查这些目录中任何文件的内容，也不检查任何子目录。

## On-load callbacks [p3_1]
- 使用onLoad添加的回调将针对每个未标记为外部(external)的唯一路径/命名空间运行。它的任务是返回模块的内容，并告诉esbuild如何解释它。
- 回调可以不返回模块内容。在这种情况下，加载模块的责任将传递给下一个注册的回调。对于给定的模块，所有插件中的所有onLoad回调将按照它们注册的顺序运行，直到其中一个负责加载模块。如果没有回调返回模块的内容，esbuild 将运行其默认的模块加载逻辑。

### On-load options
* filter
每个回调都必须提供一个过滤器(正则表达式)。当路径与此筛选器不匹配时，将跳过已注册的回调。
* namespace
可选. 如果提供、只会在提供的命名空间中模块内的路径上运行。

### On-load arguments
* path
模块的完全解析路径; 如果文件命名空间，那么它应该被视为文件系统路径，否则路径可以采取任何形式。
* namespace
模块路径所在的命名空间，由解析此文件的on-resolve回调设置; 对于使用esbuild的默认行为加载的模块，它默认为文件命名空间。
* suffix
文件路径末尾的URL query和/或hash（如果有的话）。
- 由原生路径解析行为填充，
- 由解析此文件的on-resolve回调返回
* pluginData
从上一个插件传递的

### On-load results
* contents
设置模块的内容(字符串)。
- 如果设置了此项，则不会再为此已解析路径运行更多的加载回调。
- 如果没有设置，esbuild 将继续运行在当前回调之后注册的加载回调。如果内容仍未设置，如果解析路径位于文件命名空间中，esbuild 将默认从文件系统加载内容。
* loader
如何解释内容。例如: js loader 以JavaScript来解析内容。
* resolveDir [p3_2]
在将本模块中的导入路径解析为文件系统上的实际路径时要使用的文件系统目录。
- 对于文件命名空间中的模块，默认值为模块路径的目录部分。
- 对于非文件命名空间, 除非插件提供一个值，否则此值默认为空; 如果插件没有提供一个值，esbuild 的默认行为将不解析此模块中的任何导入。
- 此目录将传递给在此模块中运行的任何未解析导入路径上的解析回调。
* errors and warnings
将路径解析过程中生成的任何日志消息传递给 esbuild，其中它们将根据当前日志级别显示在终端中，并出现在最终构建结果中。
* pluginName
* pluginData
* watchFiles and watchDirs
允许返回watch模式要扫描的其他文件系统路径。

### Caching your plugin [p3_3]
缓存可以存储在内存中（有利于与 esbuild 的重建 API 一起使用）、磁盘（有利于跨单独的构建脚本调用进行缓存），甚至可以存储在服务器上（有利于可以在不同开发人员计算机之间共享的非常缓慢的转换）。

## On-start callbacks [p4_1]
注册一个on-start回调，以便在新构建启动时收到通知。适用于所有构建，而不仅仅是初始构建，因此它对于rebuilds, watch mode, serve mode尤为有用。

- 不应该在on-start回调中进行初始化(可能会被多次运行)。如果想初始化一些东西，只需把插件初始化代码直接放在setup函数中。
- on-start回调可以是async函数、或返回一个promise; 所有插件的on-start回调都是并发运行的，然后构建会等待所有on-start回调完成才继续进行。
- on-start回调无法改变构建选项。初始构建选项只能在setup函数中进行修改，并在setup返回后被使用。

## On-end callbacks
注册一个on-end回调，以便在新构建结束时收到通知。适用于所有构建，而不仅仅是初始构建，因此它对于rebuilds, watch mode, serve mode尤为有用。
- 所有结束时回调都是串行运行的，每个回调都可以访问最终构建结果。在返回之前，它可以修改构建结果，并通过返回一个promise来延迟构建的结束。

## On-dispose callbacks
在插件不再使用时执行清理操作。无论构建是否失败，它都会在每次build()调用之后以及在给定构建上下文的第一次dispose()调用之后被调用。

## Accessing build options
在构建开始之前检查构建的配置方式以及修改构建选项。
- 构建开始后对构建选项的修改不会影响构建。
- 如果插件在第一次构建开始后改变构建选项对象，则重建、监视模式和服务模式不会更新其构建选项。

## Resolving paths[p5_1]
当插件从on-resolve回调返回结果时，该结果将完全替代esbuild内置的路径解析; 插件可以选择手动运行esbuild的路径解析并检查结果，而不是重新实现esbuild的内置行为。

- 要在特定目录中解析文件名，请确保输入路径以./开头。
- 如果不传递可选的resolveDir参数，esbuild仍将运行onResolve插件回调，但不会尝试任何路径解析。
- 在onResolve中使用相同参数调用resolve会导致无限路径解析循环。


## Example plugins

### HTTP plugin[p6_1]

### WebAssembly plugin[p6_2]

### Svelte plugin[p6_3]