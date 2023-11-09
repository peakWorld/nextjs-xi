type Params<F extends (...args: any[]) => any> = F extends (
  ...args: infer T
) => any
  ? T
  : never;

type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never;

type Tail<T extends any[]> = ((...t: T) => any) extends (
  _: any,
  ...tail: infer TT
) => any
  ? TT
  : never;

type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

type FunctionInfer<F> = F extends (...args: infer A) => infer B
  ? [A, B]
  : never;

type ClassInfer<I> = I extends Promise<infer G> ? G : never;

type ArrayInfer<T> = T extends (infer U)[] ? U : never;

type TupleInfer<T> = T extends [infer A, ...(infer B)[]] ? [A, B] : never;
type x = TupleInfer<[string, number, string]>;

// https://medium.com/free-code-camp/typescript-curry-ramda-types-f747e99744ab
// Curry V0 库里V0
