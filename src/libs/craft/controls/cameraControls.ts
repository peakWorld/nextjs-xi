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

  constructor(craft: Craft, private config: Partial<CameraControlsConfig> = {}) {
    super(craft);

    CameraControlsImpl.install({ THREE });

    const controls = new CameraControlsImpl(this.actualCamera, this.actualEle);
    this.controls = controls;
  }

  update(time: number) {
    // TODO BUG: 导致camera的position变成vector3<0,0,0>
    this.controls.update(this.craft.clock.deltaTime);
  }

  get actualCamera() {
    return this.config.camera ?? this.craft.camera;
  }

  get actualEle() {
    return this.config.ele ?? this.craft.renderer.domElement;
  }
}

export { CameraControls };
