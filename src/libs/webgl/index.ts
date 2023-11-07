import { isFunc } from "@/utils/type";
import { Shader } from "./shader";
import { Texture, type TextureType } from "./texture";
import { Camera, type TNumber } from "./camera";

interface WebglOptions {
  selector: HTMLCanvasElement | string;
}

interface ViewPort {
  x?: number;
  y?: number;
  w: number;
  h: number;
}

interface View {
  aspect: number; // 宽高比
  w: number;
  h: number;
  dp: number;
}

interface CameraVecs {
  pos: TNumber;
  up?: TNumber;
}

export class Webgl {
  dom!: HTMLCanvasElement;

  private wrapper!: Element;

  private cameras: Camera[] = [];

  gl!: WebGL2RenderingContext;

  timer!: number;

  readonly view: View = { w: 0, h: 0, aspect: 1, dp: 1 };

  constructor(private options: WebglOptions) {
    this.setDom();
    if (this.dom) {
      this.setGl();
      this.setDp();
    }
  }

  setDom() {
    const { selector } = this.options;
    if (!selector) {
      return console.log("selector 不能为空");
    }

    if (typeof selector === "string") {
      const wrapper = document.querySelector(selector);
      if (!wrapper) {
        return console.log(`${selector} 元素不存在`);
      }
      this.clearContent(wrapper);

      const canvas = document.createElement("canvas");
      wrapper?.appendChild(canvas);
      this.wrapper = wrapper;
      this.dom = canvas;
    } else {
      this.wrapper = selector;
      this.dom = selector;
    }
  }

  setDp() {
    const { dom, wrapper } = this;
    const dp = window.devicePixelRatio;
    const w = wrapper.clientWidth * dp;
    const h = wrapper.clientHeight * dp;
    // 元素尺寸(像素大小)
    dom.style.width = "100%";
    dom.style.height = "100%";
    // 画布大小
    dom.setAttribute("width", `${w}px`);
    dom.setAttribute("height", `${h}px`);

    // 元素尺寸固定, 画布越大, 那么一个像素

    // 设置视窗
    this.setViewPort({ w, h });

    // 设置视图属性
    this.view.w = w;
    this.view.h = h;
    this.view.aspect = w / h;
    this.view.dp = dp;
  }

  // 相机处理相关
  add(camera: Camera) {
    this.cameras.push(camera);
  }

  updateCamera(e: Event) {
    switch (e.type) {
      case "mousemove":
        {
          const evt = e as MouseEvent;
          this.cameras.forEach((camera) =>
            camera.onMouseMove(evt.clientX, evt.clientY)
          );
        }
        break;
      case "keyup":
        {
          const evt = e as KeyboardEvent;
          this.cameras.forEach((camera) => camera.onKeyUp(evt.key));
        }
        break;
    }
  }

  setGl() {
    this.gl = this.dom.getContext("webgl2") as WebGL2RenderingContext;
  }

  /**
   * 设置渲染窗口, 前两个参数控制窗口左下角, 三、四参数控制窗口宽、高
   * @param vp {ViewPort} 窗口参数
   */
  setViewPort(vp: ViewPort) {
    const { gl } = this;
    gl.viewport(vp?.x ?? 0, vp?.y ?? 0, vp.w, vp.h);
  }

  setScissor(vp: ViewPort, reViewport = true) {
    const { gl } = this;
    gl.scissor(vp?.x ?? 0, vp?.y ?? 0, vp.w, vp.h);
    if (reViewport) {
      this.setViewPort(vp);
    }
  }

  createShader(vsCode: string, fsCode: string) {
    const shader = new Shader(this.gl);
    shader.createProgram(vsCode, fsCode);
    return shader;
  }

  async createTexture(url: string, unit: number, type?: TextureType) {
    const texture = new Texture(this.gl, unit, type);
    await texture.createTexture(`${location.origin}${url}`);
    return texture;
  }

  createCamera(vecs: CameraVecs) {
    const camera = new Camera(vecs.pos, vecs.up);
    return camera;
  }

  render(cb: FrameRequestCallback) {
    const tick = (time: number) => {
      cb(time);
      this.timer = requestAnimationFrame(tick);
    };
    this.timer = requestAnimationFrame(tick);
  }

  // 清空子元素
  clearContent(wrapper: Element) {
    while (wrapper?.hasChildNodes() && wrapper?.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }
  }

  lose() {
    const { gl, wrapper } = this;
    const loseContextExt = gl.getExtension("WEBGL_lose_context");
    if (!loseContextExt) return;
    loseContextExt.loseContext();
    this.clearContent(wrapper);
  }
}

export interface Webgl {
  // eslint-disable-next-line
  [index: string | symbol]: any;
}

export default function createGl(options: WebglOptions) {
  const wl = new Webgl(options);
  return new Proxy(wl, {
    get(target, key) {
      const val = target[key];
      if (isFunc(val)) {
        return val.bind(target);
      }
      return val;
    },
  });
}
