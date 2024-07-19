import * as THREE from "three";
import * as Craft from "@/libs/craft";
import { World } from "./world";

export class App extends Craft.Craft {
  declare camera: THREE.PerspectiveCamera;
  declare controls: Craft.OrbitControls;
  world: World;

  constructor() {
    super("#craft");

    window.app = this;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);

    const camera = new THREE.PerspectiveCamera(75, 2, 100, 1000);
    camera.position.set(0, 0, 600);
    camera.lookAt(0, 0, 0);
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
