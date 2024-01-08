enum AnimalFlags {
  None = 0, // 0
  HasClaws = 1 << 0, // 1
  CanFly = 1 << 1, // 2
  EatsFish = 1 << 2, // 4
  Endangered = 1 << 3, // 8

  Everything = HasClaws | CanFly | EatsFish | Endangered, // 组合
}

// 枚举类型添加静态方法; 必须export才能在外部访问
namespace AnimalFlags {
  export function doSomething(flags: AnimalFlags) {
    if (flags === AnimalFlags.CanFly) {
      console.log("fly...");
    } else {
      console.log("can't fly...");
    }
  }
  export const a = 1;
}

AnimalFlags[AnimalFlags.None]; // 'None'
AnimalFlags.doSomething(AnimalFlags.CanFly);

const enum Tristate {
  False,
  True,
}
const lie = Tristate.False;

// 编译结果 => 性能提升
// let lie = 0;
