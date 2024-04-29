import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class BaseScreen {
  scene!: THREE.Scene;

  camera!: THREE.Camera;

  controls!: OrbitControls;

  lights: THREE.Light[] = [];

  constructor(protected ele: HTMLElement) {
    this.render = this.render.bind(this);
  }

  private setScissorForElement(renderer: THREE.WebGLRenderer, elem: HTMLElement, canvas: HTMLCanvasElement) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    return width / height;
  }

  protected createCamera() {
    const fov = 75;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    return camera;
  }

  protected createControl(camera: THREE.Camera, ele: HTMLElement) {
    const controls = new OrbitControls(camera, ele);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.update();
    return controls;
  }

  protected createLigth() {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    return light;
  }

  init() {
    const { ele } = this;
    this.scene = new THREE.Scene();
    this.camera = this.createCamera();
    this.controls = this.createControl(this.camera, ele);
  }

  render(renderer: THREE.WebGLRenderer, canvas: HTMLCanvasElement) {
    const { camera, scene, controls, ele } = this;
    const aspect = this.setScissorForElement(renderer, ele, canvas);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    controls.update();
    scene.background = new THREE.Color(0x000000);
    renderer.render(scene, camera);
  }

  getScreen() {
    return {
      scene: this.scene,
      camera: this.camera,
      controls: this.controls,
      ele: this.ele,
      render: this.render,
    };
  }
}
