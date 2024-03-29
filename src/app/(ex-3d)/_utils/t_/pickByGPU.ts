import * as THREE from "three";

export class PickByGPU {
  private pickingTexture!: THREE.WebGLRenderTarget;

  private pixelBuffer!: Uint8Array;

  private pickedObject!: THREE.Object3D | null;

  private pickedObjectSavedColor!: number;

  constructor(
    private renderer: THREE.WebGLRenderer,
    private scene: THREE.Scene,
    private camera: THREE.Camera,
    private idToObject: { [id: number]: THREE.Object3D }
  ) {
    // 创建一个1px的渲染目标
    this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
    this.pixelBuffer = new Uint8Array(4);

    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(cssPosition: THREE.Vector2, time: number) {
    const { pickingTexture, pixelBuffer, renderer, scene, camera, idToObject } = this;

    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = null;
    }

    // 设置视野偏移来表现鼠标下的1px
    const pixelRatio = renderer.getPixelRatio(); // 当前设备像素比
    camera.setViewOffset(
      renderer.getContext().drawingBufferWidth, // 全宽, canvas画布像素
      renderer.getContext().drawingBufferHeight, // 全高
      (cssPosition.x * pixelRatio) | 0, // 屏幕尺寸位置 转换成像素位置
      (cssPosition.y * pixelRatio) | 0, // rect y
      1, // rect width
      1 // rect height
    );
    // 渲染场景
    renderer.setRenderTarget(pickingTexture);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    // 清理视野偏移，回归正常
    camera.clearViewOffset();
    // 读取像素(偏移相机渲染1px区域，在pickingTexture中的就是此1像素区域的颜色)
    // 由于透明区域没有颜色值、继续读取到后面物体的颜色
    renderer.readRenderTargetPixels(
      pickingTexture,
      0, // x
      0, // y
      1, // width
      1, // height
      pixelBuffer
    );

    const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];

    const intersectedObject = idToObject[id];
    if (intersectedObject) {
      this.pickedObject = intersectedObject; //获取第一个对象，他是离鼠标最近的一个
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex(); // 保存颜色
      this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xffff00 : 0xff0000); // 设置对象在黄/红两色间闪烁
    }
  }
}
