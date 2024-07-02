import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Component } from "../components/component";
import type { Craft } from "../base/craft";

export interface OrbitControlsConfig {
  enableDamping: boolean;
  ele: HTMLDivElement;
  camera: THREE.PerspectiveCamera;
}

/**
 * A drop-in orbitControls
 */
class OrbitControls extends Component {
  controls: OrbitControlsImpl;
  constructor(craft: Craft, private config: Partial<OrbitControlsConfig> = {}) {
    super(craft);
    const { enableDamping = true } = config;

    const controls = new OrbitControlsImpl(this.actualCamera, this.actualEle);

    this.controls = controls;
    controls.enableDamping = enableDamping;
  }

  update(time: number) {
    this.controls.update();
  }

  get actualCamera() {
    return this.config.camera ?? this.craft.camera;
  }

  get actualEle() {
    return this.config.ele ?? this.craft.renderer.domElement;
  }
}

export { OrbitControls };
