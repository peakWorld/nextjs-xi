/** 全局模块 */

declare var ne: number; // 变量声明

declare var bar2: string;

// 声明合并(foo.d.ts)
interface Point {
  z: number;
}

declare const myPoint: Point; // 声明合并后的类型

// 修改原始类型
interface Window {
  sayA: () => void;
}

interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
