import * as THREE from "three";
import * as Craft from "@/libs/craft";
import * as utils from "./util";
import type { App } from "./index";
import type { State } from "./interface";

export class World extends Craft.Component {
  declare craft: App;
  declare container: THREE.Scene;

  state!: State;

  constructor(craft: App) {
    super(craft);

    const colorOffset = utils.randomIntegerInRange(0, 255);
    const level = 0;

    this.state = {
      colorOffset,
      level,
      currentY: 0,
      cameraPostion: new THREE.Vector3(2, 2, 2),
      lookAtPosition: new THREE.Vector3(0, 0, 0),
      boxParams: { width: 1, height: 0.2, depth: 1, x: 0, y: 0, z: 0, color: utils.updateColor(level, colorOffset) },
    };
    this.init();
  }

  init() {
    this.initCamera();
    this.initLights();
    this.createBase();
  }

  initCamera() {
    const { craft, state } = this;
    const { cameraPostion, lookAtPosition } = state;
    const { camera, controls } = craft;
    camera.position.copy(cameraPostion);
    camera.lookAt(lookAtPosition); // 计算四元数
    controls.controls.target.set(lookAtPosition.x, lookAtPosition.y, lookAtPosition.z);
  }

  initLights() {
    const light = new THREE.DirectionalLight("#ffffff", 0.5);
    light.position.set(0, 50, 0);
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.4);
    this.container.add(light);
    this.container.add(ambientLight);
  }

  createBase() {
    const { boxParams } = this.state;
    const baseParams = { ...boxParams };
    const H = 2.5;
    baseParams.height = H;
    // 设置底座<底座顶层 高出原点半个方块高度>
    baseParams.y = -(H / 2 - boxParams.height / 2);
    const base = utils.createBox(baseParams);
    this.container.add(base);
  }

  start() {
    this.goNextLevel();
  }

  goNextLevel() {
    this.state.level += 1;
    this.emit("level", this.state.level);
  }
}
