"use client";

import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { saveBlob } from "./util";
import "./screenshot.scss";

export default function Case2_3() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rendRef = useRef<() => void>();

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const fov = 75;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeCube(geometry: THREE.BoxGeometry, color: number, x: number) {
      const material = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      cube.position.x = x;
      return cube;
    }

    const cubes = [makeCube(geometry, 0x8844aa, -2), makeCube(geometry, 0x44aa88, 0), makeCube(geometry, 0xaa8844, 2)];

    const state = {
      time: 0,
    };

    // 提取实际的渲染逻辑 到单独函数
    function render() {
      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = state.time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);
    }

    function animate(time: number) {
      state.time = time * 0.001;
      render();
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    rendRef.current = render;

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  const handleScreenshot = () => {
    const canvas = ref.current as HTMLCanvasElement;
    rendRef.current?.(); // 捕获canvas截图前调用, 重新渲染一次
    canvas.toBlob((blob) => {
      if (!blob) return;
      saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
    });
  };

  return (
    <div className="gl-wrap w-full h-full">
      <canvas ref={ref} className="w-full h-full" />
      <button id="screenshot" type="button" onClick={handleScreenshot}>
        Save...
      </button>
    </div>
  );
}
