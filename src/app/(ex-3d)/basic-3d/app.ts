import * as THREE from "three";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import type { Screen } from "./interface";

const defaultOptions: THREE.WebGLRendererParameters = {
  antialias: true,
};

export class App {
  private renderer!: THREE.WebGLRenderer;

  private screen: Screen[] = [];

  private renderRequested = false;

  private canvas!: HTMLCanvasElement;

  private render() {
    const { renderer, canvas, screen } = this;

    this.renderRequested = false;

    if (!screen.length) return;

    resizeRendererToDisplaySize(renderer, canvas);
    renderer.setScissorTest(true); // TODO 待优化, 单一场景渲染需要开启吗
    screen.forEach(({ render }) => render(renderer, canvas));
  }

  private initEvent() {
    this.render = this.render.bind(this);
    this.requestRenderIfNotRequested = this.requestRenderIfNotRequested.bind(this);

    window.addEventListener("resize", this.requestRenderIfNotRequested);
    this.screen.forEach(({ controls }) => {
      controls.addEventListener("change", this.requestRenderIfNotRequested);
    });
  }

  private async init(eles: HTMLElement[]) {
    for (let ele of eles) {
      const id = ele.dataset.id;
      try {
        const Cls = (await import(`./_screen/${id}.ts`)).default;
        this.use(Cls, ele);
      } catch (err) {
        console.log(`<${id}>文件不存在、代码有问题 => `, err);
      }
    }
    this.initEvent();
    this.render(); // 触发一次
  }

  constructor(params: THREE.WebGLRendererParameters, eles?: HTMLElement[]) {
    this.renderer = new THREE.WebGLRenderer({ ...params, ...defaultOptions });
    this.canvas = params.canvas as HTMLCanvasElement;
    this.canvas.dataset.id = "base"; // 默认处理文件
    this.init(eles ?? [this.canvas]);
  }

  use(Cls: any, ele?: HTMLElement) {
    const dom = ele ?? this.canvas;
    const instance = new Cls(dom);
    instance.init();
    this.screen.push(instance.getScreen());
  }

  requestRenderIfNotRequested() {
    if (!this.renderRequested) {
      this.renderRequested = true;
      requestAnimationFrame(this.render);
    }
  }

  dispose() {
    window.removeEventListener("resize", this.requestRenderIfNotRequested);
    this.screen.forEach(({ controls }) => {
      controls.removeEventListener("change", this.requestRenderIfNotRequested);
    });

    this.renderer.dispose();
    this.screen.length = 0;
  }
}
