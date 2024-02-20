"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import "./load.scss";

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
    camera.position.z = 15;

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const cubes: THREE.Mesh[] = [];
    const loadManager = new THREE.LoadingManager(); // 加载管理器, 处理并跟踪已加载和待处理的数据
    const loader = new THREE.TextureLoader(loadManager);

    function loadColorTexture(path: string) {
      const texture = loader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    const geometry = new THREE.BoxGeometry(5, 5, 5);

    // 加载多个纹理
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

    // 加载进度处理
    const loadingElem = document.querySelector("#loading") as HTMLDivElement;
    const progressBarElem = loadingElem.querySelector(".progressbar") as HTMLDivElement;

    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal;
      progressBarElem.style.transform = `scaleX(${progress})`;
    };

    loadManager.onLoad = () => {
      loadingElem.style.display = "none";
      const cube = new THREE.Mesh(geometry, materials);
      scene.add(cube);
      cubes.push(cube);
    };

    function render(time: number) {
      time *= 0.001;

      cubes.forEach((mesh) => {
        mesh.rotation.set(time, time, time);
      });

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

  return (
    <div className="wrap w-full h-full">
      <canvas ref={ref} className="w-full h-full"></canvas>
      <div id="loading">
        <div className="progress">
          <div className="progressbar"></div>
        </div>
      </div>
    </div>
  );
}
