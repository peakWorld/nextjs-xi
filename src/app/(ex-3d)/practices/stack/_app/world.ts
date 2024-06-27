import * as THREE from "three";
import * as Craft from "@/libs/craft";
import { createBox } from "./util";
import type { App } from "./index";

export class World extends Craft.Component {
  declare craft: App;
  declare container: THREE.Scene;

  constructor(craft: App) {
    super(craft);

    this.init();
  }

  init() {
    this.initLights();
    this.createBase();
  }

  initLights() {
    const light = new THREE.DirectionalLight("#ffffff", 0.5);
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.4);
    light.position.set(0, 50, 0);
    this.container.add(light);
    this.container.add(ambientLight);
  }

  createBase() {
    const base = createBox();
    this.container.add(base);
  }
}
