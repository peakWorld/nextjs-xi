import "reflect-metadata";

declare global {
  interface Object {
    [k: string]: any;
    [k: symbol]: any;
  }
}

const metKey = Symbol("met-key");

function c() {
  console.log("ClassDecorator 求值");
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    console.log("ClassDecorator 执行");
    // 对构造函数 处理
    Object.seal(constructor);

    // 对构造函数 重载
    // class NewCls extends constructor {
    //   key = 2;
    // }
    // return NewCls;
  };
}

function m(): MethodDecorator {
  console.log("MethodDecorator 求值");
  return (target, propertyKey, descriptor) => {
    console.log("MethodDecorator 执行");
    if (target === SomeClass) {
      // 静态成员
      const original = descriptor.value as any;
      descriptor.value = ((...args: string[]) => {
        original(...args);
        console.log("hahahah");
      }) as unknown as any;
    } else {
      // 实例成员
      descriptor.enumerable = false;
    }
  };
}

function k(): PropertyDecorator {
  console.log("PropertyDecorator 求值");
  return (target, propertyKey) => {
    console.log("PropertyDecorator 执行", propertyKey);
  };
}

// 参数修饰器 和 方法装饰器 组合使用
function p(): ParameterDecorator {
  console.log("ParameterDecorator 求值");
  return (target, propertyKey, parameterIndex) => {
    console.log("ParameterDecorator 执行", propertyKey, parameterIndex);

    const existing =
      Reflect.getOwnMetadata(metKey, target, propertyKey as string) || [];
    existing.push(parameterIndex);
    Reflect.defineMetadata(metKey, existing, target, propertyKey as string);
  };
}

function mp(): MethodDecorator {
  console.log("MethodDecorator 求值 /// mp");
  return (target, propertyName, descriptor: any) => {
    console.log("MethodDecorator 执行 /// mp");
    const method = descriptor.value;

    descriptor.value = function () {
      let requiredParameters = Reflect.getOwnMetadata(
        metKey,
        target,
        propertyName as string
      );
      if (requiredParameters) {
        for (let parameterIndex of requiredParameters) {
          if (
            parameterIndex >= arguments.length ||
            arguments[parameterIndex] === undefined
          ) {
            throw new Error("Missing required argument.");
          }
        }
      }
      return method.apply(this, arguments);
    };
  };
}

@c()
class SomeClass {
  @k()
  key = 1;

  @m()
  say() {}

  @mp()
  method(@p() prop: string) {
    console.log("method...");
  }
}

const instance = new SomeClass();
// instance.method();
// SomeClass.method("2");
