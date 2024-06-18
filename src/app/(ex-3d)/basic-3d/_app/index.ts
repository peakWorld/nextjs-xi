import * as Craft from "@/libs/craft";

export class App extends Craft.Craft {
  constructor() {
    super("#craft", { autoRender: false }); // 默认渲染处理(关闭)

    this.resizer.disable(); // 默认屏幕大小变化处理(关闭)
    this.loadScreens();
  }

  async loadScreens() {
    const eles = Array.from<HTMLDivElement>(document.querySelectorAll(".content > div"));
    for (let ele of eles) {
      const id = ele.dataset.id;
      try {
        const Cls = (await import(`./screens/${id}.ts`)).default;
        new Cls(this, ele);
      } catch (err) {
        console.log(`<${id}>文件不存在、代码有问题!`, err);
      }
    }
  }
}
