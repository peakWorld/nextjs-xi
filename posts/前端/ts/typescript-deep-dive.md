[书籍目录](https://jkchao.github.io/typescript-book-chinese/)

# 项目相关

## 编译上下文
一种逻辑术语，用来给文件分组；告知ts哪些文件有效、无效，以及正在被使用的编译选项的信息。
```js
// 创建文件`tsconfig.json`
// TypeScript会把此目录和子目录下的所有.ts文件作为编译上下文的一部分，还会包含一部分默认的编译选项。
```

### 编译
好的IDE支持即时编译, 例如Vscode。手动从命令行运行编译器，如下方式
```sh
tsc # 在当前目录或者是父级目录寻找tsconfig.json文件。
tsc -w # 启用编译器的观测模式，在检测到文件改动之后，它将重新编译。
tsc -p ./project-directory # 路径可以是绝对路径、相对于当前目录的相对路径。

tsc --listFiles # 列出在编译时包含了哪些文件。
tsc --traceResolution # 查看文件为什么会被包含在编译中。
```

### 指定文件
指定要进行ts类型检查、代码转译的文件
```js
// include 指定自动查找的文件 => 编译配置生效文件, 能访问全局命名空间
// exclude 指定要排除的文件
// files 指定额外的文件, 而不是编译器自动查找 => 编译配置生效文件, 能访问全局命名空间

使用`tsc --listFiles`命令查看包含文件
```
* 为什么把一个文件放入「exclude」选项中，它仍然会被编译器选中？
```js
import * as ns from 'mod' // 以此为例

// 编译器将尝试去理解ns在模块语法中表示什么。为了理解它、编译器需要定义一个模块, 可能是包含自己代码中的.ts文件、或者导入一个.d.ts文件。
// 如果文件被找到, 那么无论它是否在excludes中、都会被编译。

// 如果想从编译中排出一个文件, 需要排出所有具有`import` 或 `<reference path="...">` 指令的文件。
```

## 声明空间

* 类型声明空间
包含用来当做类型注解的内容，但不能作为一个变量来使用
```ts
interface Bar {}

const bar: Bar // 类型注解 ✅
const bar = Bar // 变量 ❌
```

* 变量声明空间
包含可用作变量的内容、和可当做类型注解的内容
```ts
class Bar {}

const bar: Bar // 类型注解 ✅
const bar = Bar // 变量 ✅
```

## 模块

### 全局模块
默认情况下, 在一个新ts文件中写下代码时，它处于全局命名空间中; 文件中的顶级声明不能包含`import/export`
```ts
// global.d.ts
declare var bar: string;
// foo.ts
console.log(bar)
// 如果转译后的代码要在node环境中执行
// 那么bar变量必定已存在于node环境中(不管是自己代码实现、还是node源码中实现)
```
使用全局命名空间是危险的，因为它会与文件内的代码命名冲突; 对于任何需要编译成js的代码，必须使用文件模块。

### 文件模块
在ts文件的根级别位置含有`import`或者`export`，那么会在该文件中创建一个本地作用域。和全局命名空间隔离。
```ts
// bar.ts
export const bar = 3;
// foo.ts
import { bar } from './bar';
const foo = bar;
```

### 模块路径
- 相对路径模块(路径以`.`开头, 例如：`./xx`、`../xx`等)
- 动态查找模块（例如：react 或 react/core 等）

[解析模块策略]('./assets/模块解析策略.webp')
使用命令`tsc --traceResolution`查看完整的路径导入分析。

* 重写动态查找
用声明一个全局模块的方式，来解决查找模块路径的问题。
```ts
// global.d.ts
declare module 'foo' {
  export var bar: number; // some variable declarations
}
// anyOther.ts
import * as foo from 'foo';
// foo 是 { bar: number } 在没有做其他查找的情况下
```

* import/require导入语法(仅仅导入类型)
```ts
import foo = require('foo');

// 1. 导入 foo 模块的所有类型信息；
// 2. 确定 foo 模块运行时的依赖关系。

// 方式一 类型声明空间
var bar: foo; // 编译结果 let bar;

// 方式二 变量声明空间
const bar = foo; // 编译结果 const bar = foo;
```
如果没有把导入的名称当做变量声明空间来用，在编译成js时，导入的模块将会被完全移除。

## 命名空间
使用namespace关键字来描述逻辑分组
```ts
namespace Utility {
  export function log(msg: string) {
    console.log(msg);
  }
}
Utility.log("1"); // 作为变量, 只有export的属性才能访问

// 组织：可以方便地将逻辑相关的对象和类型分组在一起。
// 名称冲突：对于避免命名冲突非常重要。
```

# 类型系统

* 类型注解
在类型声明空间中可用的任何内容都可以用作类型注解。
```ts
function test(a: number): string { //参数、返回值 是类型注解
  return (a + "1") as string; // return值 是类型断言
}
```

* 内联类型注解
```ts
let name: { first: string; second: string; }; // 多次使用相同的内联注解，考虑将它重构为一个接口
```

## 特殊类型
* any
给开发者提供一个类型系统的「后门」, 将ts类型检查关闭; 因此，所有类型都能被赋值给它，它也能被赋值给其他任何类型。

* null 和 undefined
```ts
// 关闭严格模式 strict｜strictNullChecks｜alwaysStrict
let t1: number;
t1 = null; // 能被赋值给任意类型的变量

// 开启严格模式
let t2: null;
t2 = null; // 只能赋值给自身｜any类型的变量
```

* void
```ts
// 函数没有返回值 或 如下代码
let a: void = void 0;
```

* never
永不存在的类型。

* unknow
任何类型的值都可以赋给unknow类型,但是unknow类型的值只能赋给unknow本身和any类型


## 三方代码
没有对应的类型声明文件
```ts
// 在全局命名空间中新增类型声明

// 第三方代码
declare type JQuery = any;
declare var $: JQuery;

// 第三方的 NPM 模块
declare module 'jquery';
import * as $ from 'jquery';

// 非 JavaScript 资源
declare module '*.css';
```

## @types
* 模块模式
```ts
// yarn add -D @types/jquery 安装声明文件

import * as $ from 'jquery'; // 使用$的模块模式; 在代码文件中, 引入即可
```

* 全局模式
```ts
// 设置typeRoots｜types选项 => 指定类型声明注入全局命名空间

// 使用$的全局模式, 必须在types中填入jquery
$.extend; // 在代码文件中, 直接使用、无需引入;

// 执行ts类型检查、代码转译都不会报错
// 但是必须提前在全局注入jquery源码, 否则代码在执行时会报错
```

## 环境声明
运行环境中存在的代码, 非开发者代码; 对运行环境中的存在进行声明, 称为环境声明(和全局声明空间一样的效果)。
```ts
// 例如浏览器运行环境 => 通常用声明文件来实现
document // 是运行环境暴露的变量 => 那么 对应类型Document 就是环境声明
```

* 声明文件
通过declare关键字来试图告诉ts, 其他地方已经存在该代码了;
强烈建议把声明放入独立的`.d.ts`文件, 即每个根级别的声明都必须以declare关键字作为前缀
```ts
// 假设在浏览器环境运行
declare var name: number; // 告诉ts,在浏览器的运行环境中已存在变量name => 是否真的存在不确定
name = 3; // 如果运行环境中存在则执行成功，不存在则执行失败; => 开发者必须确保在代码执行, 运行环境中存在该变量
```

## lib.d.ts
该文件包含js运行时以及dom中存在各种常见的环境声明。
- 自动包含在项目的编译上下文中。
- 快速开始书写经过类型检查的js代码。
```ts
// 使用lib选项 精细控制环境声明

// 环境相关 DOM

// js相关,逐渐发展
// 语法 ES2015.Promise
// API ES2016.Array.Include

// 使用了环境不支持的语法、api, 需要使用垫片Polyfill
```

## 类型断言
用来告诉编译器你比它更了解这个类型，并且它不应该再发出错误。
```ts
let foo: any;
let bar1 = <string>foo;
let bar2 = foo as string; // ✅

interface Person { name: string }
let p1 = {} as Person;
let p2: Person = {}; // ✅

// 类型断言是不安全的, 上述Person类型 => p1不会报错、p2会报错

// 除非使用者了解需要使用的类型时，类型断言能按预期工
type Element = (event as any) as HTMLElement;
```

## 类型保护(运行时检查类型)
使用更小范围下的对象类型，缩小类型范围
```ts
// typeof
if (typeof arg === 'string')

// instanceof 和类一起使用
class Foo {}
if (arg instanceof Foo)

// in 检查对象上是否存在一个属性
if ('x' in arg)

// 字面量类型保护
type Foo = {kind: 'foo'};
if (arg.kind === 'foo')

// 使用定义的类型保护
function isFoo(arg: Foo | Bar): arg is Foo {
  return (arg as Foo).foo !== undefined;
}
if (isFoo(arg))
```

## 字面量类型
```ts
type OnlyHello = 'Hello'; // 字符串字面量类型
type OneToTwo = 1 | 2;
type Bools = true | false;


let h1: 'Hello'  // 类型注解: 'Hello'字面量类型
let h2 = 'Hello' // 类型推断: string类型

["North", "South", "East", "West"] // 数字字面量类型
const o = ["North", "South", "East", "West"] // 类型推断 => string[]
```

## 泛型
关键目的是在成员之间提供有意义的约束；成员包括：类的实例成员/类的方法/函数参数/函数返回值

## 类型推断
```ts
let bar = 'hello'; // 定义变量, 推断bar是'string'类型
function add(a: number, b: number) {return a + b;} // 函数返回值, 推断类型是'number'类型

type Adder = (a: number, b: number) => number;
let foo: Adder = (a, b) => a + b; // 赋值, 类型注解 => 推断类型

const foo = { a: 123, b: 456 };
foo.a // 字面量结构化, 推断值类型
const { a } = foo // 解构, 推断变量类型
```

## 类型兼容性
用于确定一个类型是否能赋值给其他类型。

* 结构化
只要结构匹配，名称无关紧要。

* 变体
1. 协变（Covariant）：只在同一个方向；
2. 逆变（Contravariant）：只在相反的方向；
3. 双向协变（Bivariant）：包括同一个方向和不同方向；
4. 不变（Invariant）：如果类型不完全相同，则它们是不兼容的。

* 枚举
- 枚举与数字类型相互兼容
- 来自于不同枚举的枚举变量，被认为是不兼容的

* 类
- 仅仅只有实例成员和方法会相比较，构造函数和静态成员不会被检查。
- 私有的和受保护的成员必须来自于相同的类。

* 泛型
仅当类型参数在被一个成员使用时，才会影响兼容性。
```ts
// 未被成员使用
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;
x = y; // ok

// 被成员使用
interface Empty<T> { data: T; }
let x: Empty<number>;
let y: Empty<string>;
x = y; // Error
```

### 函数
比较两个函数时, 需要考虑到的事情

* 返回类型
协变：返回类型必须包含足够的数据。

* 参数
```ts
// 参数调用 => 实参赋值形参, 就像类型注解; 推断实参类型

// 参数数量 => 更少的参数数量是好的
interface X {
  (err: Error, data: any): null
}
let x2_1: X = () => null
let x2_2: X = (err) => null
let x2_3: X = (err, data) => null
let x2_4: X = (err, data, more) => null // Error 实参数量多了
```

* 参数是逆变，返回结果是协变
```ts
// 形参、实参的参数、返回结果是父子类关系

// 形参 Animal => Animal, 实参 Dog => Dog; 实参参数Dog是形参参数Animal的子类(协变)、类型不符合
function doAnimal(cb: (animal: Animal) => Animal) {}
doAnimal((dog: Dog) => dog); // Error：参数“dog”和“animal” 的类型不兼容。

// 形参 Dog => Dog, 实参 Animal => Animal; 实参结果Animal是形参结果Animal的父类(逆变)、类型不符合
function doAnimal2(cb: (dog: Dog) => Dog) {}
doAnimal2((animal: Animal) => animal); // Error：不能将类型“Animal”分配给类型“Dog”。

function doAnimal3(cb: (dog: Dog) => Animal) {}
doAnimal3((animal: Animal) => animal); // ✅

function doAnimal4(cb: (dog: Dog) => Animal) {}
doAnimal4((dog: Dog) => dog); // ✅
```

## Never
一个可靠的，代表永远不会发生的类型。
```ts
// 一个从来不会有返回值的函数
// 一个总是会抛出错误的函数

let foo: never; // 用做类型注解

let bar: never = (() => { // never 类型仅能被赋值给另外一个 never
  throw new Error('Throw my hands in the air like I just dont care');
})();
```

* 与void的差异
当一个函数返回空值时，它的返回值为void类型；当一个函数永不返回时（或者总是抛出错误），它的返回值为never类型。

## 索引签名
TypeScript 的索引签名必须是string、number, symbols也行。

* 声明索引签名
```ts
// 指定索引签名, 所有明确的成员都必须符合索引签名
interface Foo {
  [k: string]: string;
  x: string; // 符合索引签名  ✅
  y: number; // 不符合索引签名 ❌
}
type Bar = { [k: number]: { name: string } }

// 指定有限的字符串字面量
type Index = 'a' | 'b' | 'c';
type FromIndex = { [k in Index]?: number };
const bad: FromIndex = { b: 1, c: 2, d: 3 }; // 只允许a\b\c三个变量  ❌


// string类型的索引签名比number类型的索引签名更严格
interface ArrStr {
  [key: string]: string | number; // 必须包括所用成员类型
  [index: number]: string; // 字符串索引类型的子级

  length: number; // example
  name: string;
}
```

* 索引签名的嵌套
```ts
// 字符串索引签名与有效变量混合使用 ❌
interface NestedCSS {
  color?: string;
  [selector: string]: string | NestedCSS;
}
const failsSilently: NestedCSS = { colour: 'red' }; // 'colour' 不会被捕捉到错误

// 把索引签名分离到自己的属性里 ✅
interface NestedCSS {
  color?: string;
  nest?: {
    [selector: string]: NestedCSS;
  };
}
const failsSilently: NestedCSS = { colour: 'red' }; // 捕获未知属性 'colour'
```

## 异常处理

* 错误子类型
```ts
// RangeError => 当数字类型变量或者参数超出其有效范围时
console.log.apply(console, new Array(1000000000)); // RangeError: 数组长度无效

// ReferenceError => 当引用无效时
'use strict';
console.log(notValidVar); // ReferenceError: notValidVar 未定义

// SyntaxError => 当解析无效JavaScript代码时
1 *** 3   // SyntaxError: 无效的标记 *

// TypeError => 变量或者参数不是有效类型时
'1.2'.toPrecision(1); // TypeError: '1.2'.toPrecision 不是函数。

// URIError => 当传入无效参数至 encodeURI() 和 decodeURI() 时
decodeURI('%'); // URIError: URL 异常
```

* 使用 Error
不要抛出一个原始字符串。使用Error对象的基本好处是，它能自动跟踪堆栈的属性构建以及生成位置。

## 混合
Ts/Js的类只能严格的单继承。
```ts
type Constructor<T = {}> = new (...args: any[]) => T; // mixins

// 添加属性的混合例子
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}
// 添加属性和方法的混合例子
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActivated = false;

    activate() {
      this.isActivated = true;
    }

    deactivate() {
      this.isActivated = false;
    }
  };
}

class User { name = ''; } // 简单的类
const TimestampedUser = Timestamped(User); // 添加 Timestamped 的 User
const TimestampedActivatableUser = Timestamped(Activatable(User)); // Tina Timestamped 和 Activatable 的类
```

# JSX
允许用户在Js中书写类似于HTML的视图
- 使用相同代码，既能检查Js，同时能检查HTML视图层部分。
- 图层了解运行时的上下文（加强传统 MVC 中的控制器与视图连接）。
- 复用Js设计模式维护HTML部分
这能够减少错误的可能性，并且能增加用户界面的可维护性。

* 函数式组件
```ts
type Props = { foo: string; };
const MyComponent: React.FunctionComponent<Props> = props => {
  return <span>{props.foo}</span>;
};
<MyComponent foo="bar" />;
```

# TIPS

* 名义化类型
在实际的特定用例中，有时尽管变量具有相同的结构，也需要将他们视为不同类型；使用字面量类型，使用泛型和字面量类型
```ts
// 泛型 Id 类型
type Id<T extends string> = { type: T; value: string; };
// 特殊的 Id 类型
type FooId = Id<'foo'>;
type BarId = Id<'bar'>;
// 可选：构造函数
const createFoo = (value: string): FooId => ({ type: 'foo', value });
const createBar = (value: string): BarId => ({ type: 'bar', value });
let foo = createFoo('sample');
let bar = createBar('sample');
foo = bar; // Error
foo = foo; // Okey

// 不需要类型断言，但需要服务器序列化支持。
```

* 对象字面量的惰性初始化
```ts
// 最好的解决方案 在为变量赋值的同时，添加属性及其对应的值
let foo = { bar: 123, bas: 'Hello World' };

// 快速解决方案
let foo = {} as any;
foo.bar = 123;
foo.bas = 'Hello World';

// 折中的解决方案
interface Foo { bar: number; bas: string; }
let foo = {} as Foo;
foo.bar = 123;
foo.bas = 'Hello World';
```

* 单例模式
```ts
// class方式实现

// namespace方式实现, 立即初始化
namespace Singleton {
  // 初始化的代码
  export function someMethod() {}
}
Singleton.someMethod();
```

## Reflect Metadata
```ts
// 执行yarn add reflect-metadata
// 文件中引入 import "reflect-metadata"
```

## 协变与逆变
<!-- TODO https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html-->
* 约定标记
```ts
A ≼ B 意味着 A 是 B 的子类型。
A → B 指的是以 A 为参数类型，以 B 为返回值类型的函数类型。
x : A 意味着 x 的类型为 A。
```

## infer
在extends条件语句中待推断的类型变量
```ts
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;

type Func = () => User;
type Test = ReturnType<Func>; // Test = User
```

* union 转 intersection，如：T1 | T2 -> T1 & T2
```ts
// 同一类型变量的多个候选类型将会被推断为交叉类型
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
type T21 = Bar<{ a: (x: T1) => void; b: (x: T2) => void }>; // T1 & T2

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type Result = UnionToIntersection<T1 | T2>; // T1 & T2
```

# FAQS

## 类型系统的行为

* 结构化类型
TypeScript使用结构化类型, 结构化类型系统背后的思想是如果他们的成员类型是兼容的，则他们是兼容的。在结构化的类型系统中，这些类型具有不同名称的事实并不重要，因为它们具有相同类型的成员，所以它们是相同的
```ts
class Animal {
  age = 18;
  name = "himly";
}
class Dog extends Animal {
  sex = 1;
}
class Cat {
  age = 18;
  name = "cat";
}
const an1: Animal = new Dog(); // 成员类型兼容, Dog兼容Animal; 子类型
const an1_1: Animal = new Cat(); // 成员类型兼容, Cat兼容Animal; 非子类型
const an1_2: Animal = { age: 12, name: "other" }; // 成员类型兼容; 对象字面量

const an1_3: Animal = { age: 12, name: "other", sex: 1 }; // Error: 对象字面量只能指定已知属性
const an1_4: Animal = { age: 12 }; // Error: 缺少属性 "name"

const an2_1: { age: number; name: string } = new Dog(); // 和如下字面量有相同属性, 但是兼容成功
const an2_3: { age: number; name: string } = { age: 12, name: "other", sex: 1 }; // Error: 对象字面量只能指定已知属性
```

* 类型删除
移除了类型断言、接口、类型别名和一些其他编译期间的类型结构；意味着在运行时，没有信息表明变量的类型。

* 有更少参数的函数能够赋值给具有更多参数的函数
```ts
// forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
const handler = (v) => v + 1;
[].forEach(handler);

// handler函数的参数v是回调函数中的有效参数，handler可以安全的忽略额外的参数。
```

* 一个返回值不是void的函数，可以赋值给一个返回值为void的函数
```ts
// 一个返回值类型为 void 的函数，它会说：“无论你的返回值是否存在，我都不会检查它”。
function doSomething(): number {
  return 42;
}
function callMeMaybe(callback: () => void) {
  callback();
}
callMeMaybe(doSomething);
```

## 类
永远不应该声明一个没有属性的类、接口。
```ts
class Alpha { x: number; }
class Bravo { x: number; }
class Charlie { private x: number; }
class Delta { private x: number; }

let a = new Alpha(), b = new Bravo(), c = new Charlie(), d = new Delta();

a = b; // OK
c = d; // Error

// 类进行结构上的比较
// 当一个成员是 private 或者 protected 时，它们必须来自同一个声明，才能被视为与另一个 private 或者 protected 的成员相同。
```

* 当Bar是一个类时，Bar和typeof Bar的区别
```ts
class Bar {}
let bar: Bar
let BarCls: typeof Bar

// 定义一个类时,实际上定义了两个不同的类型

// 类型一：类的实例
// Bar 类实例的类型，定义了类的实例具有的属性和方法，是一个通过调用类的构造函数来返回的类型。

// 类型二：类对象本身，作为构造函数
// typeof Bar 匿名的类型(构造函数具有的类型)，包含类中可能含有的 static 属性和方法
```

* 子类属性初始值会覆盖基类构造函数中设置的值

* 声明类和接口的区别
```ts
declare class Example {
  Method(): void;
}

interface Example {
  Method(): void;
}

// interface 适用于描述对象结构、永远不会生成代码，只是类型系统中的一个工件。
// declare class 适用于描述在外部存在的现有类。使用extends从class继承，编译器是将生成所有代码来连接原型链和转发构造函数等。
```
