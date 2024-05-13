import * as THREE from "three";

export class PickByRay {
  private raycaster!: THREE.Raycaster;

  private pickedObject!: THREE.Object3D | null;

  private pickedObjectSavedColor!: number;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }

  pick(normalizedPosition: THREE.Vector2, scene: THREE.Scene, camera: THREE.Camera, time: number) {
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = null;
    }

    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object;
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xffff00 : 0xff0000);
    }
  }

  pickObject(normalizedPosition: THREE.Vector2, scene: THREE.Object3D, camera: THREE.Camera, time: number) {
    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    return intersectedObjects?.[0]?.object;
  }
}
