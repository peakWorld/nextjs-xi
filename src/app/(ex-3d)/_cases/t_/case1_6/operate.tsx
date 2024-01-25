"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import {
  DegRadHelper,
  StringToNumberHelper,
} from "@/app/(ex-3d)/_utils/t_/helpers/index";

export default function Case1_6() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const loader = new THREE.TextureLoader();
    function loadColorTexture(path: string) {
      const texture = loader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }
    const texture = loadColorTexture("/t_/wall.jpg");

    const wrapModes = {
      ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
      RepeatWrapping: THREE.RepeatWrapping,
      MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
    };
    function updateTexture() {
      texture.needsUpdate = true;
    }

    const gui = new GUI();
    gui
      .add(new StringToNumberHelper(texture, "wrapS"), "value", wrapModes)
      .name("texture.wrapS")
      .onChange(updateTexture);
    gui
      .add(new StringToNumberHelper(texture, "wrapT"), "value", wrapModes)
      .name("texture.wrapT")
      .onChange(updateTexture);
    gui.add(texture.repeat, "x", 0, 5, 0.01).name("texture.repeat.x");
    gui.add(texture.repeat, "y", 0, 5, 0.01).name("texture.repeat.y");
    gui.add(texture.offset, "x", -2, 2, 0.01).name("texture.offset.x");
    gui.add(texture.offset, "y", -2, 2, 0.01).name("texture.offset.y");
    gui.add(texture.center, "x", -0.5, 1.5, 0.01).name("texture.center.x");
    gui.add(texture.center, "y", -0.5, 1.5, 0.01).name("texture.center.y");
    gui
      .add(new DegRadHelper(texture, "rotation"), "value", -360, 360)
      .name("texture.rotation");

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const fov = 60;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 15;

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function render(time: number) {
      time = Math.sin(time * 0.0005) * Math.PI;
      // mesh.rotation.set(time, time, time);

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
