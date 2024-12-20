import * as THREE from "three";
import * as Craft from "@/libs/craft";
import { World } from "./world";

export class App extends Craft.Craft {
  declare camera: THREE.OrthographicCamera;
  declare controls: Craft.OrbitControls;
  world: World;

  constructor() {
    super("#craft");

    window.app = this;

    this.scene.add(new THREE.AxesHelper(10));

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x0000ff, 0);

    const camera = new Craft.OrthographicCamera({ frustum: 4, near: -100 });
    this.camera = camera;

    // const controls = new Craft.OrbitControls(this);
    // this.controls = controls;

    const world = new World(this);
    this.world = world;
  }

  destroy() {
    super.destroy();
    this.world.dispose();
  }
}
