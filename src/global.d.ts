declare module "*.vs";
declare module "*.fs";

declare global {}

interface Window {
  [k: string]: any;
}

declare type Tuple<T, K = 4> = K extends 2
  ? [T, T]
  : K extends 3
  ? [T, T, T]
  : K extends 4
  ? [T, T, T, T]
  : T;
