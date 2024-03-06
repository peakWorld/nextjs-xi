"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case2_3() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      preserveDrawingBuffer: true, // 保留缓存直到手动清除或被覆盖
      alpha: true,
    });
    renderer.autoClearColor = false; // 阻止清楚颜色缓存

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-2, 2, 1, -1, -1, 1); // 正交相机下

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

    const base = new THREE.Object3D();
    scene.add(base);
    base.scale.set(0.1, 0.1, 0.1);

    function makeInstance(geometry: THREE.BoxGeometry, color: string, x: number, y: number, z: number) {
      const material = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      base.add(cube);
      cube.position.set(x, y, z);
      return cube;
    }

    makeInstance(geometry, "#F00", -2, 0, 0);
    makeInstance(geometry, "#FF0", 2, 0, 0);
    makeInstance(geometry, "#0F0", 0, -2, 0);
    makeInstance(geometry, "#0FF", 0, 2, 0);
    makeInstance(geometry, "#00F", 0, 0, -2);
    makeInstance(geometry, "#F0F", 0, 0, 2);

    const state = { x: 0, y: 0 };
    function render(time: number) {
      time = time * 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      base.position.set(state.x, state.y, 0);
      base.rotation.x = time;
      base.rotation.y = time * 1.11;

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function getCanvasRelativePosition(event: MouseEvent | Touch) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) * canvas.width) / rect.width,
        y: ((event.clientY - rect.top) * canvas.height) / rect.height,
      };
    }
    const temp = new THREE.Vector3();
    function setPosition(e: MouseEvent | Touch) {
      const pos = getCanvasRelativePosition(e);
      // 获取标准坐标系 - 坐标
      const x = (pos.x / canvas.width) * 2 - 1;
      const y = (pos.y / canvas.height) * -2 + 1;
      // 获取世界坐标 - 坐标
      temp.set(x, y, 0).unproject(camera);
      state.x = temp.x;
      state.y = temp.y;
    }

    // 鼠标移动逻辑
    canvas.addEventListener("mousemove", setPosition);
    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        setPosition(e.touches[0]);
      },
      { passive: false }
    );

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
