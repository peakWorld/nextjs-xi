import * as THREE from "three";
import { merge } from "lodash";
import gsap from "gsap";
import * as Craft from "@/libs/craft";
import * as utils from "./util";
import type { App } from "./index";
import type { State } from "./interface";

export enum Status {
  RUNNING,
  PAUSED,
}

const state: State = {
  level: 0,
  speed: 0.02,
  speedInc: 0.002,
  speedLimit: 0.05,
  moveLimit: 1.2,
  currentY: 0,
  moveAxis: "x",
  moveEdge: "width",
  colorOffset: utils.randomIntegerInRange(0, 255),
  cameraPosition: new THREE.Vector3(2, 2, 2),
  lookAtPosition: new THREE.Vector3(0, 0, 0),
  boxParams: { width: 1, height: 0.2, depth: 1, x: 0, y: 0, z: 0, color: new THREE.Color("#ffffff") },
};

export class World extends Craft.Component {
  declare craft: App;
  declare container: THREE.Scene;

  state!: State;
  status!: Status; // 开启关闭
  box!: THREE.Mesh; // 每个层级移动的方块

  constructor(craft: App) {
    super(craft);

    this.clickContainer = this.clickContainer.bind(this);

    this.init();
    this.initLights();
  }

  init() {
    this.state = merge({}, state);
    this.status = Status.PAUSED;

    this.initCamera();
    this.createBase();
    this.bindEvents();
  }

  initCamera() {
    const { craft, state } = this;
    const { cameraPosition, lookAtPosition } = state;
    const { camera } = craft;
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

  clickContainer() {
    console.log("clickContainer");
    if (this.state.level === 0) {
      return this.start();
    }
    return this.detectOverlap();
  }

  bindEvents() {
    this.craft.container.addEventListener("click", this.clickContainer, false);
  }

  unBindEvents() {
    this.craft.container.removeEventListener("click", this.clickContainer, false);
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
    this.emit("start");
    this.nextLevel();
  }

  nextLevel() {
    this.state.level += 1;
    this.emit("level", this.state.level);

    // 更新状态
    this.status = Status.RUNNING;

    // 移动方向
    this.state.moveAxis = utils.isOdd(this.state.level) ? "x" : "z";
    this.state.moveEdge = utils.isOdd(this.state.level) ? "width" : "depth";

    // 移动速度
    if (Math.abs(this.state.speed) < this.state.speedLimit) {
      this.state.speed = Math.abs(this.state.speed) + this.state.speedInc;
    }

    // 世界坐标系中Y轴高度
    this.state.currentY += this.state.boxParams.height;
    this.state.boxParams.color = utils.updateColor(this.state.level, this.state.colorOffset);

    // 生成新的移动方块
    const boxParams = { ...this.state.boxParams };
    boxParams.y = this.state.currentY;
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
    });
  }

  // 检测是否重叠
  detectOverlap() {
    const { boxParams, moveAxis, moveEdge, currentY } = this.state;
    const currentPosition = this.box.position[moveAxis];
    const prevPosition = boxParams[moveAxis];
    const direction = Math.sign(currentPosition - prevPosition);
    const edge = boxParams[moveEdge];

    // 重叠距离 边长 - 方向 * 移动距离
    const overlap = edge - direction * (currentPosition - prevPosition);

    if (overlap <= 0) {
      this.status = Status.PAUSED;
      this.dropBox(this.box);

      // 相机视角变化
      gsap.to(this.craft.camera, {
        zoom: 0.6,
        duration: 1,
        ease: "Power1.easeOut",
        onUpdate: () => {
          this.craft.camera.updateProjectionMatrix();
        },
        onComplete: () => {
          this.unBindEvents();
          this.emit("end");
        },
      });
      return;
    }

    // 重叠方块
    const overlapBoxParams = { ...boxParams };
    const overlapBoxPosition = (currentPosition - prevPosition) / 2 + prevPosition;
    overlapBoxParams.y = currentY;
    overlapBoxParams[moveAxis] = overlapBoxPosition;
    overlapBoxParams[moveEdge] = overlap;
    const overlapBox = utils.createBox(overlapBoxParams);
    this.container.add(overlapBox);

    // 切掉方块
    const slicedBoxParams = { ...boxParams };
    const slicedBoxEdge = edge - overlap;
    const slicedBoxPosition = direction * (edge / 2 + (edge - overlap / 2)) + prevPosition;
    slicedBoxParams.y = currentY;
    slicedBoxParams[moveEdge] = slicedBoxEdge;
    slicedBoxParams[moveAxis] = slicedBoxPosition;
    const slicedBox = utils.createBox(slicedBoxParams);
    this.container.add(slicedBox);
    this.dropBox(slicedBox);

    // 更新状态
    this.state.boxParams = overlapBoxParams;
    this.container.remove(this.box);
    this.nextLevel();
  }

  dropBox(box: THREE.Mesh) {
    const { moveAxis } = this.state;
    gsap.to(box.position, {
      y: "-=3.2",
      ease: "power1.easeIn",
      duration: 1.5,
      onComplete: () => {
        this.container.remove(box);
      },
    });
    gsap.to(box.rotation, {
      delay: 0.1,
      x: moveAxis === "z" ? utils.randomIntegerInRange(4, 5) : 0.1,
      y: 0.1,
      z: moveAxis === "x" ? utils.randomIntegerInRange(4, 5) : 0.1,
      duration: 1.5,
    });
  }

  update(time: number) {
    if (this.status === Status.RUNNING) {
      const { moveAxis, speed, moveLimit } = this.state;
      console.log("update", speed);
      this.box.position[moveAxis] += speed;
      // 移到末端就反转方向
      if (Math.abs(this.box.position[moveAxis]) > moveLimit) {
        this.state.speed = speed * -1;
      }
    }
  }

  dispose() {
    this.unBindEvents();
  }

  reStart() {
    console.log("reStart");
    // this.container.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     console.log("remove", child);
    //     this.container.remove(child);
    //   }
    // });

    // this.init();
  }
}
