"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { FogGUIHelper } from "@/app/(ex-3d)/_utils/t_/helpers";

export default function Case1_10() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const gui = new GUI();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const fov = 75;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 2);

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 0, 0);
    controls.update();

    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    {
      // 相机位于Z轴2的位置, 物品尺寸为1、位于Z轴0的位置
      // 雾化区域距离相机1-2, 在物品中心位置雾化结束
      const near = 1;
      const far = 2;
      const color = "lightblue";
      scene.fog = new THREE.Fog(color, near, far);
      scene.background = new THREE.Color(color);

      const fogGUIHelper = new FogGUIHelper(scene.fog as THREE.Fog, scene.background);
      gui.add(fogGUIHelper, "near", near, far).listen();
      gui.add(fogGUIHelper, "far", near, far).listen();
      gui.addColor(fogGUIHelper, "color");
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    function makeInstance(geometry: THREE.BoxGeometry, color: number, x: number) {
      const material = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = x;
      scene.add(cube);
      return cube;
    }

    const cubes = [
      makeInstance(geometry, 0x44aa88, 0),
      makeInstance(geometry, 0x8844aa, -2),
      makeInstance(geometry, 0xaa8844, 2),
    ];

    function render(time: number) {
      timer = requestAnimationFrame(render);
      time *= 0.001;

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
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
