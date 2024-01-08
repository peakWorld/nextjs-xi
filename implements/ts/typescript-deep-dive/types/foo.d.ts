/** 全局模块 */

declare namespace Foo {
  export var bar: number;
  var foo: number;
}

declare var foo: typeof Foo;

// 声明合并(global.d.ts)
interface Point {
  x: number;
  y: number;
}
