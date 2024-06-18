import * as THREE from "three";
import mitt, { type Emitter } from "mitt";
import type { Craft } from "../base/craft";

class Component {
  craft: Craft;
  emitter: Emitter<any>;
  container: THREE.Scene;
  constructor(craft: Craft) {
    this.craft = craft;
    this.craft.update((time: number) => this.update(time));

    this.emitter = mitt();
    this.container = this.craft.scene;
  }
  // 将组件添加至当前场景或替换当前场景中已有的组件
  addExisting() {
    1 + 1;
  }
  // 动画帧
  update(time: number) {
    1 + 1;
  }
  // 监听事件
  on(type: string, handler: any) {
    this.emitter.on(type, handler);
  }
  // 移除事件
  off(type: string, handler: any) {
    this.emitter.off(type, handler);
  }
  // 触发事件
  emit(type: string, event: any = {}) {
    this.emitter.emit(type, event);
  }
}

export { Component };
