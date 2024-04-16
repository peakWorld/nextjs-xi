"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case4_15() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const cellSize = 128;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("lightblue");

    const fov = 75;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-cellSize * 0.3, cellSize * 0.8, -cellSize * 0.3);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(cellSize / 2, cellSize / 3, cellSize / 2);
    controls.update();

    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    const cell = new Uint8Array(cellSize * cellSize * cellSize);
    for (let y = 0; y < cellSize; ++y) {
      for (let z = 0; z < cellSize; ++z) {
        for (let x = 0; x < cellSize; ++x) {
          const height =
            (Math.sin((x / cellSize) * Math.PI * 4) + Math.sin((z / cellSize) * Math.PI * 6)) * 20 + cellSize / 2;
          if (height > y && height < y + 1) {
            const offset = y * cellSize * cellSize + z * cellSize + x;
            cell[offset] = 1;
          }
        }
      }
    }

    const geometries: THREE.BufferGeometry[] = [];
    const m = new THREE.Matrix4();
    const material = new THREE.MeshPhongMaterial({ color: "green" });

    for (let y = 0; y < cellSize; ++y) {
      for (let z = 0; z < cellSize; ++z) {
        for (let x = 0; x < cellSize; ++x) {
          const offset = y * cellSize * cellSize + z * cellSize + x;
          const block = cell[offset];
          if (block) {
            m.makeTranslation(x, y, z);
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            geometry.applyMatrix4(m);
            geometries.push(geometry);
            m.identity();
          }
        }
      }
    }
    // 合并几何体
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
    const mesh = new THREE.Mesh(mergedGeometry, material);
    scene.add(mesh);

    let renderRequested = false;
    function render() {
      renderRequested = false;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      controls.update();
      renderer.render(scene, camera);
    }
    render();

    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
      }
    }

    controls.addEventListener("change", requestRenderIfNotRequested);
    window.addEventListener("resize", requestRenderIfNotRequested);

    return () => {
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
