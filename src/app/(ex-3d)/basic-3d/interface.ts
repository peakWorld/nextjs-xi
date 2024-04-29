import * as THREE from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";

export interface Screen {
  scene: THREE.Scene;
  camera: THREE.Camera;
  controls: OrbitControls;
  ele: HTMLElement;
}
