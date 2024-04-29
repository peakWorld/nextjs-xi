import * as THREE from "three";
import BaseScreen from "./base";

export default class Winter extends BaseScreen {
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
    const { ele } = this;
    this.scene = new THREE.Scene();
    this.camera = this.createCamera();
    this.controls = this.createControl(this.camera, ele);
    this.addLights();
    this.addMesh();
  }
}
