"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
// import AxisGridHelper from "@/app/(ex-3d)/_utils/t_/helpers/axisGrid";

export default function Case1_5() {
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
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 35;

    {
      const ambientLight = new THREE.AmbientLight(0x000000);
      scene.add(ambientLight);

      const color = 0xffffff;
      const intensity = 500;
      const pointlight = new THREE.PointLight(color, intensity);
      pointlight.position.set(20, 12, 15);
      scene.add(pointlight);
    }

    const geometry = new THREE.TorusKnotGeometry(10, 3, 200, 32);

    // 方式一：材质参数
    const material = new THREE.MeshPhongMaterial({
      color: "#44f604",
      flatShading: true,
    });
    // 方式二：材质实例改变属性
    // const material = new THREE.MeshPhongMaterial();
    // material.color.setHSL(0, 1, 0.5); // 红色
    // material.flatShading = true;

    // 卡通着色
    // const material = new THREE.MeshToonMaterial({
    //   color: "#44f604",
    // });

    // 特殊材质
    // const material = new THREE.MeshNormalMaterial();

    // const material = new THREE.MeshDepthMaterial();
    // camera.near = 10; // 深度材质必须修改该值, 否则展示不出来

    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    gui
      .add({ flatShading: true }, "flatShading")
      .name("flatShading")
      .onChange((flag) => {
        material.flatShading = flag;
        material.needsUpdate = true;

        // 注
        // 1、flatShading改变
        // 2、添加或删除纹理：即从使用无纹理切换到使用纹理，或者从使用纹理切换到无纹理; 改变纹理是可以的
        // 需要设置 material.needsUpdate = true。
      });

    function render(time: number) {
      time *= 0.001;

      torus.rotation.set(time, time, time);

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
