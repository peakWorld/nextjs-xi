"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { ColorGUIHelper, DegRadHelper } from "@/app/(ex-3d)/_utils/t_/helpers/index";

export default function Case1_7() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const gui = new GUI();
    RectAreaLightUniformsLib.init(); // 必须引入初始化

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 5, 0);
    controls.update();

    // 矩形光
    {
      const color = 0xffffff;
      const intensity = 1;
      const width = 12;
      const height = 4;
      const light = new THREE.RectAreaLight(color, intensity, width, height);
      light.position.set(0, 10, 0);
      light.rotation.x = THREE.MathUtils.degToRad(-90);
      scene.add(light);

      const helper = new RectAreaLightHelper(light);
      light.add(helper);

      gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
      gui.add(light, "intensity", 0, 10, 0.01);
      gui.add(light, "width", 0, 20);
      gui.add(light, "height", 0, 20);
      gui.add(new DegRadHelper(light.rotation, "x"), "value", -180, 180).name("x rotation");
      gui.add(new DegRadHelper(light.rotation, "y"), "value", -180, 180).name("y rotation");
      gui.add(new DegRadHelper(light.rotation, "z"), "value", -180, 180).name("z rotation");

      makeXYZGUI(gui, light.position, "position", () => {});
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
      const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.rotation.x = Math.PI * -0.5;
      scene.add(plane);

      const cubeSize = 4;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshStandardMaterial({ color: "#8AC" });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.set(cubeSize + 1, cubeSize / 2, 0);
      scene.add(cube);

      const sphereRadius = 3;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
      const sphereMat = new THREE.MeshStandardMaterial({ color: "#CA8" });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      scene.add(sphere);
    }

    function makeXYZGUI(gui: GUI, vector3: THREE.Vector3, name: string, onChangeFn: () => void) {
      const folder = gui.addFolder(name);
      folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
      folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
      folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
      folder.open();
    }

    function render(time: number) {
      timer = requestAnimationFrame(render);
      time *= 0.001;

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
