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

const getState: () => State = () => ({
  level: 0, // 当前游戏关卡数
  speed: 0.02, // 方块移动的基础速度
  speedInc: 0.002, // 每关速度的增量，使游戏逐渐变难
  speedLimit: 0.05, // 方块移动速度的上限
  moveLimit: 1.2, // 方块在x/z轴上移动的最大距离（从中心点算起）
  currentY: 0, // 当前方块的y轴位置（高度）
  moveAxis: "x", // 当前方块移动的轴向："x" 或 "z"
  moveEdge: "width", // 当前切割的边："width" 或 "depth"
  colorOffset: utils.randomIntegerInRange(0, 255), // 方块颜色的随机偏移值，用于生成渐变色
  cameraPosition: new THREE.Vector3(2, 2, 2), // 相机的初始位置（斜45度俯视）
  lookAtPosition: new THREE.Vector3(0, 0, 0), // 相机看向的位置（场景中心点）
  boxParams: {
    width: 1, // 方块宽度
    height: 0.2, // 方块高度
    depth: 1, // 方块深度
    x: 0, // x轴位置
    y: 0, // y轴位置
    z: 0, // z轴位置
    color: new THREE.Color("#ffffff"), // 方块颜色
  },
});

export class World extends Craft.Component {
  declare craft: App;
  declare container: THREE.Scene;

  state!: State;
  status!: Status; // 运动停止
  box!: THREE.Mesh; // 每个层级移动的方块

  constructor(craft: App) {
    super(craft);

    this.init();
    this.initLights();
    this.clickContainer = this.clickContainer.bind(this);
  }

  init() {
    this.state = merge({}, getState());
    this.status = Status.PAUSED; // 设置初始游戏状态为暂停

    this.initCamera(); // 初始化相机设置
    this.createBase(); // 创建游戏基座（最底部的方块）
  }

  initCamera() {
    const { craft, state } = this;
    const { cameraPosition, lookAtPosition } = state;
    const { camera } = craft;
    camera.position.copy(cameraPosition);
    camera.lookAt(lookAtPosition); // 计算四元数
  }

  initLights() {
    const light = new THREE.DirectionalLight("#ffffff", 0.5);
    light.position.set(0, 50, 0);
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.4);
    this.container.add(light);
    this.container.add(ambientLight);
  }

  clickContainer() {
    if (this.state.level === 0) {
      return this.start();
    }
    return this.detectOverlap();
  }

  createBase() {
    const { boxParams } = this.state;
    const baseParams = { ...boxParams };
    const H = 20;
    baseParams.height = H;
    // 设置底座<底座顶层 高出原点半个方块高度>
    // 确保第一层方块的y轴位置为0.2
    baseParams.y = -H / 2 + boxParams.height / 2;
    baseParams.color = utils.updateColor(0, this.state.colorOffset);
    const base = utils.createBox(baseParams);
    this.container.add(base);
  }

  start() {
    this.nextLevel();
  }

  nextLevel() {
    this.state.level += 1;

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

    // 在render前会根据新position,复用四元数 重新计算相机位置
    gsap.to(this.craft.camera.position, {
      y: this.state.cameraPosition.y,
      duration: 0.4,
    });
  }

  // 检测是否重叠
  detectOverlap() {
    // 从状态中获取必要参数
    const { boxParams, moveAxis, moveEdge, currentY } = this.state;
    // 获取当前移动方块在移动轴上的位置
    const currentPosition = this.box.position[moveAxis];
    // 获取当前移动方块在移动轴上的初始位置
    const prevPosition = boxParams[moveAxis];
    // 计算移动方向（1或-1）：当前位置减去前一个位置的正负号
    const direction = Math.sign(currentPosition - prevPosition);
    // 获取当前切割边的长度（width或depth）
    const edge = boxParams[moveEdge];

    // 计算重叠距离：
    // edge: 方块的边长
    // direction * (currentPosition - prevPosition): 方块移动的实际距离（考虑方向）
    // 如果重叠为负，表示完全没有重叠；如果为正，表示重叠的长度
    const overlap = edge - direction * (currentPosition - prevPosition);

    // 如果没有重叠，游戏结束
    if (overlap <= 0) {
      this.status = Status.PAUSED;
      this.dropBox(this.box); // 让当前方块掉落

      // 缩小相机视角以展示游戏结束效果
      gsap.to(this.craft.camera, {
        zoom: 0.6,
        duration: 1,
        ease: "Power1.easeOut",
        onUpdate: () => {
          this.craft.camera.updateProjectionMatrix();
        },
        onComplete: () => {},
      });
      return;
    }

    // 创建重叠部分的新方块
    const overlapBoxParams = { ...boxParams };
    // 计算重叠部分的中心位置：前一个位置和当前位置的中点
    const overlapBoxPosition = (currentPosition - prevPosition) / 2 + prevPosition;
    overlapBoxParams.y = currentY;
    overlapBoxParams[moveAxis] = overlapBoxPosition;
    overlapBoxParams[moveEdge] = overlap; // 设置重叠部分的长度
    const overlapBox = utils.createBox(overlapBoxParams);
    this.container.add(overlapBox);

    // 创建被切掉的部分（将掉落的部分）
    const slicedBoxParams = { ...boxParams };
    // 计算切掉部分的长度
    const slicedBoxEdge = edge - overlap;
    // 计算切掉部分的中心位置：
    // direction * (edge/2 + (edge-overlap/2)): 根据方向确定切掉部分的偏移量
    // prevPosition: 加上前一个方块的位置作为基准点
    const slicedBoxPosition = direction * (edge / 2 + (edge - overlap / 2)) + prevPosition;
    slicedBoxParams.y = currentY;
    slicedBoxParams[moveEdge] = slicedBoxEdge;
    slicedBoxParams[moveAxis] = slicedBoxPosition;
    const slicedBox = utils.createBox(slicedBoxParams);
    this.container.add(slicedBox);
    this.dropBox(slicedBox); // 让切掉的部分掉落

    // 更新游戏状态：使用重叠部分作为下一层的基准
    this.state.boxParams = overlapBoxParams;
    this.container.remove(this.box); // 移除原始移动方块
    this.nextLevel(); // 进入下一关
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
      this.box.position[moveAxis] += speed;
      // 移到末端就反转方向
      if (Math.abs(this.box.position[moveAxis]) > moveLimit) {
        this.state.speed = speed * -1;
      }
    }
  }

  dispose() {}

  restart() {
    console.log("restart");

    // 相机还原
    gsap.to(this.craft.camera, {
      zoom: 1,
      duration: 1,
      ease: "Power1.easeOut",
      onUpdate: () => {
        this.craft.camera.updateProjectionMatrix();
      },
      onComplete: () => {},
    });

    // 删除旧数据
    const childIds: number[] = [];
    this.container.children.forEach((child) => {
      if (child?.isMesh) {
        childIds.push(child.id);
      }
    });

    this.container.remove(
      ...childIds.map((id) => {
        const obj = this.container.getObjectById(id);
        return obj as THREE.Object3D;
      })
    );

    // 初始化新状态
    this.init();
  }
}
