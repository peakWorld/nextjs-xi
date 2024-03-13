import TWEEN from "three/addons/libs/tween.module.js";

export class TweenManger {
  private numTweensRunning: number;

  constructor() {
    this.numTweensRunning = 0;
  }
  _handleComplete() {
    --this.numTweensRunning;
    console.assert(this.numTweensRunning >= 0);
  }
  createTween(targetObject: Record<any, any>) {
    const self = this;
    ++this.numTweensRunning;
    let userCompleteFn: any = () => {};
    // 创建一个新的Tween, 并应用我们自己的回调函数
    const tween = new TWEEN.Tween(targetObject).onComplete(function (...args: any[]) {
      self._handleComplete();
      // @ts-ignore
      userCompleteFn.call(this, ...args);
    });
    // 用我们自己的onComplete代替它的,
    // 因此, 如果用户提供回调, 我们可以调用用户的回调
    tween.onComplete = (fn) => {
      userCompleteFn = fn;
      return tween;
    };
    return tween;
  }
  update() {
    TWEEN.update();
    return this.numTweensRunning > 0;
  }
}
