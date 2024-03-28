import * as THREE from "three";

class AllMaterialPropertyGUIHelper {
  private prop!: string;

  private scene!: THREE.Scene;

  constructor(prop: string, scene: THREE.Scene) {
    this.prop = prop;
    this.scene = scene;
  }
  get value(): any {
    const { scene, prop } = this;
    let v;
    scene.traverse((obj) => {
      if (obj.material && obj.material[prop] !== undefined) {
        v = obj.material[prop];
      }
    });
    return v;
  }
  set value(v) {
    const { scene, prop } = this;
    scene.traverse((obj) => {
      if (obj.material && obj.material[prop] !== undefined) {
        obj.material[prop] = v;
        obj.material.needsUpdate = true;
      }
    });
  }
}

export default AllMaterialPropertyGUIHelper;
