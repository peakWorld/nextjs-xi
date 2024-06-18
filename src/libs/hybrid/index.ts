/*
 * @Author: lyf
 * @Date: 2021-10-20 21:01:38
 * @LastEditors: lyf
 * @LastEditTime: 2021-10-25 19:40:45
 * @Description: hybrid
 * @FilePath: /js-css-case/src/utils/hybrid/index.ts
 */
import IosBridge from "./ios";
import * as utils from "./utils";

type Cb = string | (() => void);
type InvokeParams =
  | [actionName: string]
  | [actionName: string, cb: Cb]
  | [actionName: string, params: Record<string, any>]
  | [actionName: string, params: Record<string, any>, cb: Cb]
  | [actionName: string, params: Record<string, any>, cb: Cb, preCb: Cb];

export default class JsBridge {
  static _protocolScheme = "nativechannel://";

  static _cbNamespace = "JsBridge__Callback";

  static _noCallback = () => console.log("callback does not exist");

  /* 待处理队列 */
  static _quene: string[] = [];

  /* 回调函数计数 */
  static _cbUniqueId = 0;

  /* 是否完成初始化 */
  static _isJsBridgeReady = false;

  /* 桥 */
  _bridge: (message: string) => void = null as any;

  /* 安装 */
  static install() {
    let jsBridge = window.jsBridge;

    if (!window[this._cbNamespace]) {
      window[this._cbNamespace] = {};
    }

    if (!jsBridge) {
      window.jsBridge = jsBridge = new JsBridge();
    }

    return jsBridge;
  }

  /* 与客户端的交互 */
  get _nativeBridge() {
    let bridge = this._bridge;
    if (!bridge) {
      if (utils.os === "ios") {
        bridge = this._iosBridge;
      } else if (utils.os === "android") {
        bridge = this._andrBridge;
      } else {
        bridge = (message: string) => console.log("not in any native platform", message);
      }
      this._bridge = bridge;
    }
    return bridge;
  }

  /* 与安卓的交互 */
  _andrBridge(message: string) {
    window.prompt(message);
  }

  /* 与ios的交互 */
  _iosBridge(message: string) {
    IosBridge.postMessage(message);
  }

  /* 初始化 */
  _init() {
    if (document.readyState !== "loading") {
      this._ready();
    } else {
      document.addEventListener("DOMContentLoaded", this._ready);
    }
  }

  /* 真正执行初始化的地方 */
  _ready() {
    document.removeEventListener("DOMContentLoaded", this._ready);
    if (JsBridge._isJsBridgeReady) {
      return;
    }
    JsBridge._isJsBridgeReady = true;
    this._consume();
  }

  /* 消费 */
  _consume() {
    if (!JsBridge._isJsBridgeReady || !JsBridge._quene.length) {
      return;
    }
    const message = JsBridge._quene.shift() as string;
    this._nativeBridge(message);
    this._consume();
  }

  /* 生产 */
  _produce(...invokeParams: InvokeParams) {
    const [actionName] = invokeParams;
    if (!actionName) {
      return;
    }
    const [params, cb, preCb] = this._checkInvokeParams(invokeParams);
    if (preCb) {
      params["preCallback"] = this._doCallback(preCb, `JsBridge_PreCb_${actionName}_${JsBridge._cbUniqueId++}`);
    }

    if (cb) {
      params["callback"] = this._doCallback(preCb, `JsBridge_Cb_${actionName}_${JsBridge._cbUniqueId++}`);
    }

    const message = this._packMessage(actionName);
    JsBridge._quene.push(message);
    this._consume();
  }

  _doCallback(cb: Cb, name: string) {
    // 回调函数集合如果不存在
    if (!window[JsBridge._cbNamespace]) {
      window[JsBridge._cbNamespace] = {};
    }

    const cbType = utils.checkType(cb);
    if (cbType === "string") {
      const cbSteps = (cb as string).split(".");
      cb = window as any;
      try {
        cbSteps.forEach((name) => {
          // @ts-ignore
          cb = cb[name];
        });
      } catch (e) {
        cb = JsBridge._noCallback;
      }
    }

    if (!cb || cbType !== "function") {
      cb = JsBridge._noCallback;
    }

    window[name] = (...args: any[]) => {
      const formatedArgs = args.map((arg) => {
        const argType = utils.checkType(arg);
        if (argType === "number") {
          arg = (arg as number).toString();
        }
        // json
        if (argType === "object") {
          arg = JSON.stringify(arg);
        }
        // json string
        if (argType === "String" && /^{.*}$/.test(arg as string)) {
          arg = (arg as string).replace(/"(state|status)"\s*:\s*(\d+)/g, `"$1":"$2"`);
        }
        return arg as string;
      });

      (cb as (...arg: any) => void).apply(null, [...formatedArgs]);
    };

    return `${JsBridge._cbNamespace}.${name}`;
  }

  /* 校验协议参数 */
  _checkInvokeParams(invokeParams: InvokeParams) {
    const paramsLen = invokeParams.length;
    let [params, cb, preCb] = invokeParams.slice(1);
    const paramsType = utils.checkType(params);
    const cbType = utils.checkType(cb);
    const preCbType = utils.checkType(preCb);
    if (paramsLen === 2) {
      if (paramsType === "function" || paramsType === "string") {
        cb = params as any;
        params = undefined as any;
      } else if (paramsType !== "object") {
        params = undefined as any;
      }
    }

    if (paramsLen === 3 || paramsLen === 4) {
      if (paramsType !== "object") {
        params = undefined as any;
      }
      if (cbType !== "function") {
        cb = undefined as any;
      }
      if (preCbType !== "function") {
        preCb = undefined as any;
      }
    }
    return [params || {}, cb, preCb] as [Record<string, any>, Cb, Cb];
  }

  /* 按规则格式化 带传递给客户端的信息 */
  _packMessage(actionName: string, params?: Record<string, any>) {
    let message = `${JsBridge._protocolScheme}${actionName}`;
    if (params) {
      message += `?params=${encodeURIComponent(JSON.stringify(params))}`;
    }
    return message;
  }

  private constructor() {
    this._init();
  }

  /* 初始化之前的准备工作 */
  ready() {
    console.log("ready...");
  }

  invoke = this._produce;
}

declare global {
  interface Window {
    jsBridge: JsBridge;
  }
}
