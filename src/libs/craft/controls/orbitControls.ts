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
  constructor(craft: Craft, config: Partial<OrbitControlsConfig> = {}) {
    super(craft);
    const { enableDamping = true } = config;

    const controls = new OrbitControlsImpl(config.camera ?? craft.camera, config.ele ?? craft.renderer.domElement);

    this.controls = controls;
    controls.enableDamping = enableDamping;
  }
  update(time: number) {
    this.controls.update();
  }
}

export { OrbitControls };
