import type { Craft } from "../base/craft";

export interface AnimatorConfig {
  autoRender: boolean;
}

class Animator {
  craft: Craft;
  tasks: any[];
  autoRender: boolean;
  constructor(craft: Craft, config: Partial<AnimatorConfig> = {}) {
    const { autoRender = true } = config;

    this.autoRender = autoRender;

    this.craft = craft;
    this.tasks = [];
  }
  add(fn: any) {
    this.tasks.push(fn);
  }
  update() {
    this.craft.renderer.setAnimationLoop((time: number) => {
      this.tick(time);
    });
  }
  tick(time = 0) {
    this.tasks.forEach((task) => {
      task(time);
    });

    if (this.autoRender) {
      this.craft.render();
    }
  }
  stop() {
    this.craft.renderer.setAnimationLoop(null);
  }
}

export { Animator };
