export default class IosBridge {
  static _quene: HTMLIFrameElement[] = [];

  static _getIfr() {
    if (this._quene.length > 0) {
      return this._quene.shift();
    }
    const ifr = document.createElement("iframe");
    ifr.setAttribute("style", "display:none;");
    ifr.setAttribute("height", "0px");
    ifr.setAttribute("width", "0px");
    ifr.setAttribute("frameborder", "0");
    document.body.appendChild(ifr);
    return ifr;
  }

  static postMessage(message: string) {
    const ifr = this._getIfr() as HTMLIFrameElement;
    ifr.src = message;

    setTimeout(() => {
      this._quene.push(ifr);
    }, 20);
  }
}
