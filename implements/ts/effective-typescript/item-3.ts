/** 在运行时检查 TypeScript 类型 */

interface Square {
  width: number;
}
interface Rectangle extends Square {
  height: number;
}
type Shape = Square | Rectangle;

// 属性检查
// 仅涉及运行时可用的值，但是仍然允许类型检查器shape的类型细化为Rectangle
function calculateArea(shape: Shape) {
  if ("height" in shape) {
    shape; // Type is Rectangle
    return shape.width * shape.height;
  } else {
    shape; // Type is Square
    return shape.width * shape.width;
  }
}

// 标记联合
// 为了在运行时恢复类型信息，在TypeScript中无处不在
interface Square2 {
  kind: "square";
  width: number;
}
interface Rectangle2 {
  kind: "rectangle";
  height: number;
  width: number;
}
type Shape2 = Square2 | Rectangle2;
function calculateArea2(shape: Shape2) {
  if (shape.kind === "rectangle") {
    shape; // Type is Rectangle
    return shape.width * shape.height;
  } else {
    shape; // Type is Square
    return shape.width * shape.width;
  }
}

// 引入类型和值
class Square3 {
  constructor(public width: number) {}
}
class Rectangle3 extends Square3 {
  constructor(public width: number, public height: number) {
    super(width);
  }
}
type Shape3 = Square3 | Rectangle;
function calculateArea3(shape: Shape3) {
  if (shape instanceof Rectangle3) {
    shape; // Type is Rectangle
    return shape.width * shape.height;
  } else {
    shape; // Type is Square
    return shape.width * shape.width; // OK
  }
}

/** */
