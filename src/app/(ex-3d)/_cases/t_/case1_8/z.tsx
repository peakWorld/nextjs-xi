"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { MinMaxGUIHelper } from "@/app/(ex-3d)/_utils/t_/helpers/index";

export default function Case1_8() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      logarithmicDepthBuffer: true, // 解决z冲突
    });

    const fov = 45;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.00001;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const gui = new GUI();
    gui.add(camera, "fov", 1, 180);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
    gui.add(minMaxGUIHelper, "min", 0.00001, 100, 0.00001).name("near");
    gui.add(minMaxGUIHelper, "max", 0.1, 100, 0.1).name("far");

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();

    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 0);
      light.target.position.set(-5, 0, 0);
      scene.add(light);
      scene.add(light.target);
    }

    {
      const planeSize = 40;
      const loader = new THREE.TextureLoader();
      const texture = loader.load("/t_/checker.png");
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.rotation.x = Math.PI * -0.5;
      scene.add(plane);

      const sphereRadius = 3;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthDivisions,
        sphereHeightDivisions
      );
      const numSpheres = 20;
      for (let i = 0; i < numSpheres; ++i) {
        const sphereMat = new THREE.MeshPhongMaterial();
        sphereMat.color.setHSL(i * 0.73, 1, 0.5);
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(
          -sphereRadius - 1,
          sphereRadius + 2,
          i * sphereRadius * -2.2
        );
        scene.add(mesh);
      }
    }

    function render() {
      timer = requestAnimationFrame(render);

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      controls.update();
      renderer.render(scene, camera);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      controls.dispose();
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
