import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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
    const { renderer, canvas } = this;

    this.renderRequested = false;
    resizeRendererToDisplaySize(renderer, canvas);
    renderer.setScissorTest(true);

    this.screen.forEach(({ scene, camera, ele, controls }) => {
      const aspect = this.setScissorForElement(ele);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      controls.update();
      scene.background = new THREE.Color(0x000000);
      renderer.render(scene, camera);
    });
  }

  private setScissorForElement(elem: HTMLElement) {
    const canvasRect = this.canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    const positiveYUpBottom = canvasRect.height - bottom;
    this.renderer.setScissor(left, positiveYUpBottom, width, height);
    this.renderer.setViewport(left, positiveYUpBottom, width, height);

    return width / height;
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
        new Cls(this, ele);
      } catch (err) {
        console.log(`<${id}>文件不存在、代码有问题 => `, err);
      }
    }
    this.initEvent();
    this.render(); // 触发一次
  }

  constructor(params: THREE.WebGLRendererParameters, eles: HTMLElement[]) {
    this.renderer = new THREE.WebGLRenderer({ ...params, ...defaultOptions });
    this.canvas = params.canvas as HTMLCanvasElement;

    this.init(eles);
  }

  addScreen(screen: Screen) {
    this.screen.push(screen);
  }

  createCamera() {
    const fov = 75;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    return camera;
  }

  createControl(camera: THREE.Camera, ele: HTMLElement) {
    const controls = new OrbitControls(camera, ele);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.update();
    return controls;
  }

  createLigth() {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    return light;
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
