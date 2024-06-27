import * as THREE from "three";
import * as Craft from "@/libs/craft";
import { World } from "./world";

export class App extends Craft.Craft {
  declare camera: THREE.OrthographicCamera;

  constructor() {
    super("#craft");

    this.renderer.setClearColor(0x000000, 0);

    const lookAt = new THREE.Vector3(0, 0, 0);
    const camera = new Craft.OrthographicCamera({ frustum: 4 });
    camera.position.set(2, 2, 2);
    camera.lookAt(lookAt); // 计算四元数
    this.camera = camera;

    const controls = new Craft.CameraControls(this);
    controls.controls.setTarget(lookAt.x, lookAt.y, lookAt.z);

    new World(this);
  }
}
