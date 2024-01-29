"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import {
  ColorGUIHelper,
  DegRadHelper,
} from "@/app/(ex-3d)/_utils/t_/helpers/index";

export default function Case1_7() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const gui = new GUI();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const fov = 45;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();

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

      const cubeSize = 4;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.set(cubeSize + 1, cubeSize / 2, 0);
      scene.add(cube);

      const sphereRadius = 3;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthDivisions,
        sphereHeightDivisions
      );
      const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      scene.add(sphere);
    }

    function makeXYZGUI(
      gui: GUI,
      vector3: THREE.Vector3,
      name: string,
      onChangeFn: () => void
    ) {
      const folder = gui.addFolder(name);
      folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
      folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
      folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
      folder.open();
    }

    // 环境光
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.AmbientLight(color, intensity);
      light.visible = false;
      scene.add(light);

      const folder = gui.addFolder("AmbientLight(环境光)");
      folder
        .addColor(new ColorGUIHelper(light, "color"), "value")
        .name("color");
      folder.add(light, "intensity", 0, 2, 0.01);
      folder.add(light, "visible");
      folder.close();
    }

    // 半球光
    {
      const skyColor = 0xb1e1ff; // 天空发出光线的颜色
      const groundColor = 0xb97a20; // 地面发出光线的颜色
      const intensity = 1;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      light.visible = false;
      scene.add(light);

      const folder = gui.addFolder("HemisphereLight(半球光)");
      folder
        .addColor(new ColorGUIHelper(light, "color"), "value")
        .name("skyColor");
      folder
        .addColor(new ColorGUIHelper(light, "groundColor"), "value")
        .name("groundColor");
      folder.add(light, "intensity", 0, 2, 0.01);
      folder.add(light, "visible");
      folder.close();
    }

    // 方向光
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 0); // 光源位置
      light.target.position.set(-5, 0, 0); // 目标位置
      light.visible = false;
      scene.add(light);
      scene.add(light.target); // 目标位置必须添加到scene

      const helper = new THREE.DirectionalLightHelper(light); // 辅助线
      helper.visible = false;
      scene.add(helper);

      // @ts-ignore
      function updateLight() {
        helper.update();
      }

      const folder = gui.addFolder("DirectionalLight(方向光)");
      folder
        .addColor(new ColorGUIHelper(light, "color"), "value")
        .name("color");
      folder.add(light, "intensity", 0, 2, 0.01);
      makeXYZGUI(folder, light.position, "position", updateLight);
      makeXYZGUI(folder, light.target.position, "target", updateLight);
      folder.add(light, "visible").onChange((visible) => {
        helper.visible = visible;
      });
      folder.close();
    }

    // 点光源
    {
      const color = 0xffffff;
      const intensity = 150;
      const light = new THREE.PointLight(color, intensity);
      light.position.set(0, 10, 0);
      light.visible = false;
      scene.add(light);

      const helper = new THREE.PointLightHelper(light);
      helper.visible = false;
      scene.add(helper);

      // @ts-ignore
      function updateLight() {
        helper.update();
      }

      const folder = gui.addFolder("PointLightHelper(点光源)");
      folder
        .addColor(new ColorGUIHelper(light, "color"), "value")
        .name("color");
      folder.add(light, "intensity", 0, 250, 1);
      folder.add(light, "distance", 0, 40).onChange(updateLight);
      makeXYZGUI(folder, light.position, "position", updateLight);
      folder.add(light, "visible").onChange((visible) => {
        helper.visible = visible;
      });
      folder.close();
    }

    // 聚光灯
    {
      const color = 0xffffff;
      const intensity = 150;
      const light = new THREE.SpotLight(color, intensity);
      light.position.set(0, 10, 0); // 光源位置
      light.target.position.set(-5, 0, 0); // 目标位置
      light.visible = false;
      scene.add(light);
      scene.add(light.target);

      const helper = new THREE.SpotLightHelper(light);
      helper.visible = false;
      scene.add(helper);

      // @ts-ignore
      function updateLight() {
        helper.update();
      }

      const folder = gui.addFolder("SpotLight(聚光灯)");
      folder
        .addColor(new ColorGUIHelper(light, "color"), "value")
        .name("color");
      folder.add(light, "intensity", 0, 250, 1);
      folder.add(light, "distance", 0, 40).onChange(updateLight);
      folder
        .add(new DegRadHelper(light, "angle"), "value", 0, 90)
        .name("angle")
        .onChange(updateLight);
      folder.add(light, "penumbra", 0, 1, 0.01);
      makeXYZGUI(folder, light.position, "position", updateLight);
      makeXYZGUI(folder, light.target.position, "target", updateLight);
      folder.add(light, "visible").onChange((visible) => {
        helper.visible = visible;
      });
      folder.close();
    }

    function render(time: number) {
      timer = requestAnimationFrame(render);
      time *= 0.001;

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
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
