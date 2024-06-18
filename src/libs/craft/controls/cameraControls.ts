import * as THREE from "three";
import CameraControlsImpl from "camera-controls";
import type { Craft } from "../base/craft";
import { Component } from "../components/component";

export interface CameraControlsConfig {
  ele: HTMLDivElement;
  camera: THREE.PerspectiveCamera;
}

/**
 * A wrapper for https://github.com/yomotsu/camera-controls
 */
class CameraControls extends Component {
  controls: CameraControlsImpl;
  constructor(craft: Craft, config: Partial<CameraControlsConfig> = {}) {
    super(craft);

    CameraControlsImpl.install({ THREE });

    const controls = new CameraControlsImpl(config.camera ?? craft.camera, config.ele ?? craft.renderer.domElement);
    this.controls = controls;
  }
  update(time: number) {
    this.controls.update(this.craft.clock.deltaTime);
  }
}

export { CameraControls };
