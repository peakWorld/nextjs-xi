import * as THREE from "three";
import * as Craft from "@/libs/craft";

export default class Screen extends Craft.Component {
  craft: Craft.Craft;
  ele: HTMLDivElement;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  controls: Craft.CameraControls;

  lights: THREE.Light[] = [];

  protected createLigth() {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    return light;
  }

  constructor(craft: Craft.Craft, ele: HTMLDivElement) {
    super(craft);
    this.craft = craft;
    this.ele = ele;
    this.scene = craft.scene.clone(); // 每个场景设置成一个新的场景(忽略默认场景)

    const camera = craft.camera.clone() as THREE.PerspectiveCamera; // 每个场景设置成一个新的相机(忽略默认相机)
    camera.position.z = 2;
    const lookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAt);
    this.camera = camera;

    const controls = new Craft.CameraControls(craft, { ele, camera: this.camera });
    controls.controls.setTarget(lookAt.x, lookAt.y, lookAt.z);
    this.controls = controls;

    this.addMeshAndLight();
  }

  addMeshAndLight() {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({ color: 0x8844aa });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  applyViewScissor() {
    // 更新渲染区域(canvas元素)的大小
    this.craft.resizer.resizeRenderer(this.craft.renderer);

    // 更新相机设置
    const { width, height } = this.ele.getBoundingClientRect();
    const aspect = width / height;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    // 更新裁剪区域(忽略默认相机)
    Craft.applyViewScissor(this.craft, this.ele);
  }

  update(time: number): void {
    this.applyViewScissor();

    // 每个场景单独渲染
    this.craft.renderer.render(this.scene, this.camera);
  }
}
