//1. moduleA中根据全局状态来执行不同逻辑
// 不行: 编译器会将所有import导入提升到文件顶部
// window.a = 1;
// import "./moduleA";
// 可行: 将全局状态修改封装到文件中再导入
import "./modify";
import "./moduleA";

//2. #私有属性
// target: ["es6"] 可知是weakSet/weakMap的语法糖, 带来额外的性能开销
class T1 {
  #name = "wind";

  #sayName() {}
}

//3. eval
//3.1 范围提升优化后, 能访问其他模块中的变量
// t1是modify模块中的变量(不执行tree-shaking)
console.log(eval("t1"));

//3.2 避免使用直接eval(间接调用)
global.x = 1;
global.y = 2;
function testEval() {
  let x = 3,
    y = 4;
  // 直接调用，使用局部作用域
  console.log(eval("x + y"));
  // 间接调用，使用全局作用域
  var geval = eval;
  console.log(geval("x + y"));
  console.log((0, eval)("x + y"));

  // Function的变量, 使用全局作用域
  console.log(new Function("return x+y;")());
  // console.log(new Function("x", "y", "return x+y;")(5, 6));
}
// testEval();
