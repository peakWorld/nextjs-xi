import * as THREE from "three";
import type { EffectComposer } from "three-stdlib";
import { Animator, Resizer, Clock, Mouse, Physics, Keyboard } from "../components";
import { downloadBlob } from "../utils";

export interface CraftConfig {
  gl: THREE.WebGLRendererParameters;
  autoRender: boolean;
  autoAdaptMobile: boolean;
}

class Craft {
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  container: HTMLDivElement;
  animator: Animator;
  composer: EffectComposer | null;
  clock: Clock;
  mouse: Mouse;
  physics: Physics;
  resizer: Resizer;
  keyboard: Keyboard;
  renderRequested: boolean;

  constructor(sel = "#craft", config: Partial<CraftConfig> = {}) {
    const { gl = {}, autoRender = true, autoAdaptMobile = false } = config;

    this.renderRequested = false;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      ...gl,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer = renderer;

    const container = document.querySelector(sel) as HTMLDivElement;
    container?.appendChild(renderer.domElement);
    this.container = container;

    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 100);
    camera.position.z = 1;
    this.camera = camera;

    const scene = new THREE.Scene();
    this.scene = scene;

    const animator = new Animator(this, {
      autoRender,
    });
    this.animator = animator;

    this.composer = null;

    const clock = new Clock(this);
    this.clock = clock;

    const mouse = new Mouse(this);
    this.mouse = mouse;

    const physics = new Physics(this);
    this.physics = physics;

    const resizer = new Resizer(this, {
      autoAdaptMobile,
    });
    this.resizer = resizer;

    const keyboard = new Keyboard();
    this.keyboard = keyboard;

    this.init();

    this.addEventListeners();
  }

  init() {
    this.animator.update();
  }

  addEventListeners() {
    // resize
    this.resizer.listenForResize();

    // mouse
    this.mouse.listenForMouse();

    // keyboard
    this.keyboard.listenForKey();
  }

  update(fn: any) {
    this.animator.add(fn);
  }

  render() {
    this.renderRequested = false;

    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  requestRenderIfNotRequested() {
    if (!this.renderRequested) {
      this.renderRequested = true;
      requestAnimationFrame(() => this.render());
    }
  }

  async saveScreenshot(name = `screenshot.png`) {
    this.render();
    const blob: Blob | null = await new Promise((resolve) => {
      this.renderer.domElement.toBlob(resolve, "image/png");
    });
    if (blob) {
      downloadBlob(blob, name);
    }
  }

  destroy() {
    this.animator.stop();

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();

        Object.values(child.material).forEach((value: any) => {
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        });
      }
    });
    this.renderer.dispose();

    this.container.removeChild(this.renderer.domElement);
  }
}

export { Craft };
