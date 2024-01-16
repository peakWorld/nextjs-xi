// 函数重载 包含声明函数和实现函数, 实现函数必须与所有重载兼容

// 函数重载-多参数
function padding(all: number): Padding;
function padding(topAndBottom: number, leftAndRight: number): Padding;
function padding(
  top: number,
  right: number,
  bottom: number,
  left: number
): Padding;

function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d,
  };
}

padding(1); // Okay: all
padding(1, 1); // Okay: topAndBottom, leftAndRight
padding(1, 1, 1, 1); // Okay: top, right, bottom, left

// 函数重载-多类型
interface Human {
  age: number;
}
interface Animal {
  type: string;
}
function say(sw: Human): string;
function say(sw: Animal): string;
function say(sw: Animal | Human) {
  return "age" in sw ? "Human" : "Animal";
}
say({ age: 18 });
say({ type: "dog" });

// 函数声明
interface Func {
  new (a: string): void;
  (b: number): void;
}
declare const foo: Func; // 声明变量foo存在, 但代码运行时不存在
new foo("a");
foo(1);
