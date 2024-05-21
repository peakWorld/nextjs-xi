declare module "*.glsl";

declare global {
  declare module "three" {
    export interface Object3D {
      [k: string]: any;
    }
  }
}

interface Window {
  [k: string]: any;
}

declare type Tuple<T, K = 4> = K extends 2 ? [T, T] : K extends 3 ? [T, T, T] : K extends 4 ? [T, T, T, T] : T;
