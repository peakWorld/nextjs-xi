import "reflect-metadata";

const otK = Symbol("Object");
const arK = Symbol("Array");

const obj = { x: 1 };
const arr = ["a", "b"];

// 给对象｜数组赋值元数据
Reflect.defineMetadata(otK, [1, 3, 5], obj);
Reflect.defineMetadata(arK, { m: "m" }, arr);
console.log("getMetadata obj =>", Reflect.getMetadata(otK, obj));
console.log("getMetadata arr =>", Reflect.getMetadata(arK, arr));

// 给对象｜数组中某个键 赋值元数据
Reflect.defineMetadata(otK, [2, 4, 6], obj, "x");
Reflect.defineMetadata(arK, { m: "m" }, arr, "0");
console.log("getMetadata obj.x =>", Reflect.getMetadata(otK, obj, "x"));
console.log("getMetadata arr[0] =>", Reflect.getMetadata(arK, arr, "0"));
