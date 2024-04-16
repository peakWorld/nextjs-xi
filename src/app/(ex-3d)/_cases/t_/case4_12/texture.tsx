"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize, drawRandomDot } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case4_12() {
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

    const cubes: THREE.Mesh[] = [];

    const geometry = new THREE.BoxGeometry(5, 5, 5);

    // canvas纹理
    const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const texture = new THREE.CanvasTexture(ctx.canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const mesh = new THREE.Mesh(geometry, material);
    cubes.push(mesh);
    scene.add(mesh);

    function render(time: number) {
      time *= 0.001;

      // 每一帧更新canvas纹理, 需要设置needsUpdate
      drawRandomDot(ctx);
      texture.needsUpdate = true;

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

  return <canvas ref={ref} className="w-full h-full" />;
}
