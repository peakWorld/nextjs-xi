import * as THREE from "three";
import gsap from "gsap";
import * as Craft from "@/libs/craft";
import * as utils from "./util";
import type { App } from "./index";
import type { State } from "./interface";

export enum Status {
  RUNNING,
  PAUSED,
}

export class World extends Craft.Component {
  declare craft: App;
  declare container: THREE.Scene;

  state!: State;
  status!: Status; // 开启关闭
  box!: THREE.Mesh; // 每个层级移动的方块

  constructor(craft: App) {
    super(craft);

    this.status = Status.PAUSED;

    this.state = {
      level: 0,
      speed: 0.02,
      speedInc: 0.005,
      speedLimit: 0.5,
      moveLimit: 1.2,
      currentY: 0,
      moveAxis: "x",
      colorOffset: utils.randomIntegerInRange(0, 255),
      cameraPosition: new THREE.Vector3(2, 2, 2),
      lookAtPosition: new THREE.Vector3(0, 0, 0),
      boxParams: { width: 1, height: 0.2, depth: 1, x: 0, y: 0, z: 0, color: new THREE.Color("#ffffff") },
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
    const { cameraPosition, lookAtPosition } = state;
    const { camera, controls } = craft;
    camera.position.copy(cameraPosition);
    camera.lookAt(lookAtPosition); // 计算四元数
    // controls.controls.target.set(lookAtPosition.x, lookAtPosition.y, lookAtPosition.z);
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
    baseParams.color = utils.updateColor(0, this.state.colorOffset);
    const base = utils.createBox(baseParams);
    this.container.add(base);
  }

  start() {
    this.nextLevel();
  }

  nextLevel() {
    this.state.level += 1;
    this.emit("level", this.state.level);

    // 更新状态
    this.status = Status.RUNNING;

    // 移动方向
    this.state.moveAxis = utils.isOdd(this.state.level) ? "x" : "z";

    // 移动速度
    if (this.state.speed < this.state.speedLimit) {
      this.state.speed += this.state.speedInc;
    }

    // 世界坐标系中Y轴高度
    this.state.currentY += this.state.boxParams.height;

    // 生成新的移动方块
    const boxParams = { ...this.state.boxParams };
    boxParams.y = this.state.currentY;
    boxParams.color = utils.updateColor(this.state.level, this.state.colorOffset);
    const box = utils.createBox(boxParams);
    this.container.add(box);
    this.box = box;

    // 确定初始移动位置
    this.box.position[this.state.moveAxis] = this.state.moveLimit * -1;

    // 移动相机来切换视角
    if (this.state.level >= 1) {
      this.updateCameraHeight();
    }
  }

  updateCameraHeight() {
    this.state.cameraPosition.y += this.state.boxParams.height;

    // 在render前会根据新position\复用四元数 重新计算相机位置
    gsap.to(this.craft.camera.position, {
      y: this.state.cameraPosition.y,
      duration: 0.4,
      onUpdate: () => {
        console.log(this.craft.camera.matrix.elements.toString());
      },
    });
  }

  update(time: number) {
    if (this.status === Status.RUNNING) {
      const { moveAxis, speed, moveLimit } = this.state;
      this.box.position[moveAxis] += speed;
      // 移到末端就反转方向
      if (Math.abs(this.box.position[moveAxis]) > moveLimit) {
        this.state.speed = speed * -1;
      }
    }
  }
}
