import * as THREE from "three";

class DegRadHelper {
  constructor(private obj: Record<string, any>, private prop: string) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop]);
  }
  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v);
  }
}

export default DegRadHelper;
