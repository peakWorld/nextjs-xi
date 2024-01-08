myPoint.z; // 全局命名空间中的变量, 直接访问

// 实现接口
class MyPoint implements Point {
  x = 1;
  y = 2;
  z = 3;
}

new MyPoint().x;

// 接口无法约束类的构造函数
// interface Crazy {
//   new (): { hello: number };
// }

// class CrazyClass implements Crazy {
//   constructor() {
//     return { hello: 1 };
//   }
// }
