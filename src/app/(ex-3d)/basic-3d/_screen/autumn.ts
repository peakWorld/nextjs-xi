import * as THREE from "three";
import BaseScreen from "./base";

export default class Autumn extends BaseScreen {
  private addLights() {
    const light = super.createLigth();
    this.scene.add(light);
  }

  private addMesh() {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({ color: 0x8844aa });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  init() {
    super.init();
    this.addLights();
    this.addMesh();
  }
}
