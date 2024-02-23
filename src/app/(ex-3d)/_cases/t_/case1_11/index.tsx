"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case1_10() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const gui = new GUI();

    // 渲染目标-生成纹理
    const rtWidth = 512;
    const rtHeight = 512;
    const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
      depthBuffer: false,
      stencilBuffer: false,
    });

    const rtScene = new THREE.Scene();
    rtScene.background = new THREE.Color("red");

    const rtFov = 75;
    const rtAspect = rtWidth / rtHeight;
    const rtNear = 0.1;
    const rtFar = 5;
    const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
    rtCamera.position.z = 2;

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    rtScene.add(light);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const rtGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry: THREE.BoxGeometry, color: number, x: number) {
      const material = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = x;
      rtScene.add(cube);
      return cube;
    }

    const rtCubes = [
      makeInstance(rtGeometry, 0x44aa88, 0),
      makeInstance(rtGeometry, 0x8844aa, -2),
      makeInstance(rtGeometry, 0xaa8844, 2),
    ];

    // 真实渲染-使用纹理
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const fov = 60;
    const aspect = 1; // 默认canvas的宽高比
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 5);

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 0, 0);
    controls.update();

    {
      const color = 0xffffff;
      const intensity = 2.5;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(3, 4, 5);
      scene.add(light);
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ map: renderTarget.texture }); // 使用渲染目标-纹理
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function render(time: number) {
      time *= 0.001;

      rtCubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.setRenderTarget(renderTarget);
      renderer.render(rtScene, rtCamera);
      renderer.setRenderTarget(null);

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      mesh.rotation.x = time;
      mesh.rotation.y = time * 1.1;
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
