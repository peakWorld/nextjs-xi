"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { ColorGUIHelper } from "@/app/(ex-3d)/_utils/t_/helpers/index";

export default function Case4_4() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const gui = new GUI();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const fov = 75;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 25;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.enableDamping = true;

    function addLight(...pos: [number, number, number]) {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...pos);
      scene.add(light);
    }

    addLight(-1, 2, 4);
    addLight(1, -1, -2);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry: THREE.BoxGeometry, color: THREE.Color, x: number, y: number, z: number) {
      // 让立方体变得透明
      const material = new THREE.MeshPhongMaterial({
        color,
        opacity: 0.5, // 透明度 值0.0表示完全透明，1.0表示完全不透明
        transparent: true, // 开启透明度, 此处必须设置为true
        side: THREE.DoubleSide,
      });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      cube.position.set(x, y, z);

      return cube;
    }

    function hsl(h: number, s: number, l: number) {
      return new THREE.Color().setHSL(h, s, l);
    }

    {
      const d = 0.8;
      makeInstance(geometry, hsl(0 / 8, 1, 0.5), -d, -d, -d);
      makeInstance(geometry, hsl(1 / 8, 1, 0.5), d, -d, -d);
      makeInstance(geometry, hsl(2 / 8, 1, 0.5), -d, d, -d);
      makeInstance(geometry, hsl(3 / 8, 1, 0.5), d, d, -d);
      makeInstance(geometry, hsl(4 / 8, 1, 0.5), -d, -d, d);
      makeInstance(geometry, hsl(5 / 8, 1, 0.5), d, -d, d);
      makeInstance(geometry, hsl(6 / 8, 1, 0.5), -d, d, d);
      makeInstance(geometry, hsl(7 / 8, 1, 0.5), d, d, d);
    }

    let renderRequested = false;
    function render() {
      renderRequested = false;
      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
    }
    render(); // 渲染一次

    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
      }
    }

    // 增加阻尼感, 体验更加真实
    controls.addEventListener("change", requestRenderIfNotRequested); // 改变摄像机设置的时候渲染场景
    window.addEventListener("resize", requestRenderIfNotRequested); // 改变窗口大小的时候渲染场景

    return () => {
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
      controls.removeEventListener("change", requestRenderIfNotRequested);
      window.removeEventListener("resize", requestRenderIfNotRequested);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
