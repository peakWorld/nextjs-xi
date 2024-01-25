"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case1_7() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const gui = new GUI();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const fov = 60;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 35;

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0x000000);
    scene.add(ambientLight);

    const color = 0xffffff;
    const intensity = 500;
    const pointlight = new THREE.PointLight(color, intensity);
    pointlight.position.set(20, 12, 15);
    scene.add(pointlight);

    function render(time: number) {
      time *= 0.001;

      // torus.rotation.set(time, time, time);

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
