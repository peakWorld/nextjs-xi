import * as THREE from "three";

class ColorGUIHelper {
  constructor(private object: Record<string, any>, private prop: string) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

export default ColorGUIHelper;
