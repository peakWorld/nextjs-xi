"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case1_6() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const fov = 60;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 35;

    {
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);
    }

    const loader = new THREE.TextureLoader();
    function loadColorTexture(path: string) {
      const texture = loader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    const geometry = new THREE.BoxGeometry(5, 5, 5);

    // 纹理
    const material = new THREE.MeshBasicMaterial({
      map: loadColorTexture("/t_/wall.jpg"),
    });

    // 在立方体的每个面上都有不同的纹理
    const materials = [
      new THREE.MeshBasicMaterial({
        map: loadColorTexture("/t_/flowers/flower-1.jpg"),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture("/t_/flowers/flower-2.jpg"),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture("/t_/flowers/flower-3.jpg"),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture("/t_/flowers/flower-4.jpg"),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture("/t_/flowers/flower-5.jpg"),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture("/t_/flowers/flower-6.jpg"),
      }),
    ];

    const mesh = new THREE.Mesh(geometry, materials);
    scene.add(mesh);

    function render(time: number) {
      time *= 0.001;

      mesh.rotation.set(time, time, time);

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
