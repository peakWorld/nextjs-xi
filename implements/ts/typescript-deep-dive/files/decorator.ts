import "reflect-metadata";

// 在类上定义元数据，key 为 `classMetaData`，value 为 `a`
function classDecorator(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata("classMetaData", "a", target);
  };
}

// 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `b`
function methodDecorator(): MethodDecorator {
  return (target, key, descriptor) => {
    Reflect.defineMetadata("methodMetaData", "b", target, key);
  };
}

@classDecorator()
class SomeClass {
  @methodDecorator()
  someMethod() {}
}
const instance = new SomeClass();

console.log(Reflect.getMetadata("classMetaData", SomeClass)); // 'a'
console.log(
  Reflect.getMetadata("methodMetaData", instance, "someMethod") // 'b
);
