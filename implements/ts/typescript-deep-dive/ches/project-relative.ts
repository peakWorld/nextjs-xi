namespace Utility {
  export function log(msg: string) {
    console.log(msg);
  }
  export function error(msg: string) {
    console.log(msg);
  }
}

Utility.error(foo.bar.toString());
Utility.error(foo.foo.toString());
Utility.log(bar2);

$.extend; // @types的全局模式

ne = 3; // 声明文件(全局模式)中 => 变量

window.sayA(); // 原始类型新增静态方法

let x: { foo: number; [x: string]: any }; // 索引签名

// 对象字面量进行类型检查
function logName(something: { name: string }) {
  console.log(something.name);
}
const person = { name: "matt", job: "being awesome" };
const randow = { note: `No name`, nam2: `Not name` };
logName(person); // ok
logName(randow); // Error: 没有 `name` 属性 | 错误的属性名
logName({ name: "matt" }); // ok
logName({ name: "matt", job: "being awesome" }); // Error: 对象字面量只能指定已知属性，`job` 属性在这里并不存在。

// 用于创建字符串列表(字面量数组)映射至 `K: V` 的函数
function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}
const Direction = strEnum(["North", "South", "East", "West"]);
type Direction = keyof typeof Direction;

// & 或者 |
interface A {
  type: string;
  name: "a";
}
interface B {
  type: string;
  key: "b";
}
const a: A | B = { type: "h", key: "b" };
const b: A & B = { type: "h", name: "a", key: "b" };
