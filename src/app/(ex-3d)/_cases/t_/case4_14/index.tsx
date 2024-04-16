"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { ResourceTracker } from "@/app/(ex-3d)/_utils/t_/resourceTracker";

export default function Case4_14() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const fov = 75;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const cubes: THREE.Mesh[] = [];

    function addStuffToScene() {
      const resTracker = new ResourceTracker();
      const track = resTracker.track.bind(resTracker);

      const boxWidth = 1;
      const boxHeight = 1;
      const boxDepth = 1;
      const geometry = track(new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth));

      const loader = new THREE.TextureLoader();
      const texture = loader.load("/t_/wall.jpg");
      texture.colorSpace = THREE.SRGBColorSpace;

      const material = track(
        new THREE.MeshBasicMaterial({
          map: track(texture),
        })
      );
      const cube = track(new THREE.Mesh(geometry, material));
      scene.add(cube);
      cubes.push(cube);
      return resTracker;
    }

    // 测试释放资源
    function waitSeconds(seconds = 0) {
      return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }
    async function process() {
      for (;;) {
        const resTracker = addStuffToScene();
        await waitSeconds(2);
        cubes.length = 0;
        resTracker.dispose();
        await waitSeconds(1);
      }
    }
    process();

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cube, ndx) => {
        const speed = 0.2 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

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
