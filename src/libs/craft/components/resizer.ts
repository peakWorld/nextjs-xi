import * as THREE from "three";
import { Craft } from "../base/craft";
import { Component } from "./component";
import { OrthographicCamera } from "../cameras";
import type { EffectComposer } from "three-stdlib";

export interface ResizerConfig {
  autoAdaptMobile: boolean;
}

class Resizer extends Component {
  enabled: boolean;
  autoAdaptMobile: boolean;

  constructor(craft: Craft, config: Partial<ResizerConfig> = {}) {
    super(craft);

    this.enabled = true;

    const { autoAdaptMobile = false } = config;

    this.autoAdaptMobile = autoAdaptMobile;

    if (this.autoAdaptMobile) {
      this.resize();
    }
  }
  get size() {
    const domElement = this.craft.container;
    return {
      w: domElement.clientWidth,
      h: domElement.clientHeight,
    };
  }
  get aspect() {
    const { w, h } = this.size;
    return w / h;
  }
  resizeRenderer(renderer: THREE.WebGLRenderer) {
    const { w, h } = this.size;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }
  resizeComposer(composer: EffectComposer) {
    const { w, h } = this.size;
    composer.setSize(w, h);
    if (composer.setPixelRatio) {
      composer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    }
  }
  resizeCamera(camera: THREE.Camera) {
    const { aspect } = this;

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    } else if (camera instanceof OrthographicCamera) {
      const { frustum, useAspect } = camera;
      if (frustum) {
        const actualAspect = useAspect ? aspect : 1;

        [camera.left, camera.right, camera.top, camera.bottom] = [
          actualAspect * frustum * -0.5,
          actualAspect * frustum * 0.5,
          frustum * 0.5,
          frustum * -0.5,
        ];
        camera.updateProjectionMatrix();
      }
    }
  }
  resize() {
    if (this.enabled) {
      const { craft } = this;
      const { renderer, camera, composer } = craft;

      // renderer
      this.resizeRenderer(renderer);

      // composer
      if (composer) {
        this.resizeComposer(composer);
      }

      // camera
      this.resizeCamera(camera);

      // mobile
      if (this.autoAdaptMobile) {
        this.adaptMobile();
      }
    }

    this.emit("resize");
  }
  listenForResize() {
    window.addEventListener("resize", () => this.resize());
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
  adaptMobile() {
    const { craft, size } = this;
    const { renderer, camera } = craft;
    const { w: width, h: height } = size;

    if (width > height) {
      renderer.setSize(width, height);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    } else {
      renderer.setSize(height, width);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = height / width;
        camera.updateProjectionMatrix();
      }
    }
  }
}

export { Resizer };
