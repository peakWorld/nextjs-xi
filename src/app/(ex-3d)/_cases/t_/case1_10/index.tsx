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
    camera.position.set(0, 0, 15);

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

    // Fog
    {
      const fog = new THREE.Fog(0xffffff, 12, 18);
      gui
        .add({ visible: false }, "visible")
        .name("Fog")
        .onChange((flag) => {
          if (flag) {
            scene.fog = fog;
            scene.background = new THREE.Color("#fff");
          } else {
            scene.fog = null;
          }
        });
    }

    // FogExp2
    {
      const fog = new THREE.FogExp2(0xffffff, 0.1);
      gui
        .add({ visible: false }, "visible")
        .name("FogExp2")
        .onChange((flag) => {
          if (flag) {
            scene.fog = fog;
            scene.background = new THREE.Color("#fff");
          } else {
            scene.fog = null;
          }
        });
    }

    // fog blue, background red
    {
      const fog = new THREE.Fog("blue", 12, 18);
      gui
        .add({ visible: false }, "visible")
        .name("fog blue, background red")
        .onChange((flag) => {
          if (flag) {
            scene.fog = fog;
            scene.background = new THREE.Color("red");
          } else {
            scene.fog = null;
          }
        });
    }

    // fog blue, background blue
    {
      const fog = new THREE.Fog("blue", 12, 18);
      gui
        .add({ visible: false }, "visible")
        .name("fog blue, background red")
        .onChange((flag) => {
          if (flag) {
            scene.fog = fog;
            scene.background = new THREE.Color("blue");
          } else {
            scene.fog = null;
          }
        });
    }

    const geometry = new THREE.BoxGeometry(4, 3, 10);
    const material = new THREE.MeshPhongMaterial({ color: "hsl(130,50%,50%)" });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function render(time: number) {
      timer = requestAnimationFrame(render);
      time *= 0.001;
      mesh.rotation.set(time * 0.1, time * 0.11, 0);

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
