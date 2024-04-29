import * as THREE from "three";
import type { App } from "../app";

export default class Spring {
  private init() {
    const { app, ele } = this;

    const scene = new THREE.Scene();
    const camera = app.createCamera();
    const controls = app.createControl(camera, ele);
    const light = app.createLigth();
    scene.add(light);
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({ color: 0x8844aa });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    app.addScreen({ scene, camera, controls, ele });
  }

  constructor(private app: App, private ele: HTMLElement) {
    this.init();
  }
}
