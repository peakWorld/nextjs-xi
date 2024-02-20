"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { ColorGUIHelper, DimensionGUIHelper, MinMaxGUIHelper } from "@/app/(ex-3d)/_utils/t_/helpers/index";

export default function Case1_9() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const gui = new GUI();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });
    renderer.shadowMap.enabled = true; // 设置渲染器中的阴影属性

    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2; // 默认canvas的宽高比
    const near = 5;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 5, 0);
    controls.update();

    function makeXYZGUI(gui: GUI, vector3: THREE.Vector3, name: string, onChangeFn: () => void) {
      const folder = gui.addFolder(name);
      folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
      folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
      folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
      folder.open();
    }

    // 方向光
    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 0);
      light.target.position.set(-4, 0, -4);
      light.castShadow = true; // 设置光能投射阴影
      light.visible = false;
      scene.add(light);
      scene.add(light.target);

      const helper = new THREE.DirectionalLightHelper(light); // 光源辅助线
      helper.visible = false;
      scene.add(helper);

      const cameraHelper = new THREE.CameraHelper(light.shadow.camera); // 光源阴影相机辅助线
      cameraHelper.visible = false;
      scene.add(cameraHelper);

      // @ts-ignore
      function updateLight() {
        helper.update();

        light.shadow.camera.updateProjectionMatrix(); // 更新阴影像机投影矩阵
        cameraHelper.update();
      }

      const folder = gui.addFolder("DirectionalLight(方向光)");
      folder.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
      folder.add(light, "intensity", 0, 2, 0.01);
      makeXYZGUI(folder, light.position, "position", updateLight);
      makeXYZGUI(folder, light.target.position, "target", updateLight);
      // 光源阴影相机
      {
        const folder2 = folder.addFolder("Shadow Camera");
        folder2
          .add(new DimensionGUIHelper(light.shadow.camera, "left", "right"), "value", 1, 100)
          .name("width")
          .onChange(updateLight);
        folder2
          .add(new DimensionGUIHelper(light.shadow.camera, "bottom", "top"), "value", 1, 100)
          .name("height")
          .onChange(updateLight);
        const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, "near", "far", 0.1);
        folder2.add(minMaxGUIHelper, "min", 0.1, 50, 0.1).name("near").onChange(updateLight);
        folder2.add(minMaxGUIHelper, "max", 0.1, 50, 0.1).name("far").onChange(updateLight);
        folder2.add(light.shadow.camera, "zoom", 0.01, 1.5, 0.01).onChange(updateLight);
      }
      folder.add(light, "visible").onChange((visible) => {
        helper.visible = visible;
        cameraHelper.visible = visible;
      });
      folder.close();
    }

    // 点光源
    {
      const cubeSize = 30;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({
        color: "#CCC",
        side: THREE.BackSide,
      });
      const mesh = new THREE.Mesh(cubeGeo, cubeMat); // 外部罩子
      mesh.receiveShadow = true;
      mesh.position.set(0, cubeSize / 2 - 0.1, 0);
      scene.add(mesh);

      const color = 0xffffff;
      const intensity = 150;
      const light = new THREE.PointLight(color, intensity);
      light.position.set(0, 10, 0);
      light.castShadow = true; // 设置光能投射阴影
      light.visible = false;
      scene.add(light);

      const helper = new THREE.PointLightHelper(light);
      helper.visible = false;
      scene.add(helper);

      const cameraHelper = new THREE.CameraHelper(light.shadow.camera); // 光源阴影相机辅助线
      cameraHelper.visible = false;
      scene.add(cameraHelper);

      // @ts-ignore
      function updateLight() {
        helper.update();

        light.shadow.camera.updateProjectionMatrix(); // 更新阴影像机投影矩阵
        cameraHelper.update();
      }

      const folder = gui.addFolder("PointLightHelper(点光源)");
      folder.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
      folder.add(light, "intensity", 0, 250, 1);
      folder.add(light, "distance", 0, 40).onChange(updateLight);
      makeXYZGUI(folder, light.position, "position", updateLight);
      {
        const folder2 = folder.addFolder("Shadow Camera");
        const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, "near", "far", 1);
        folder2.add(minMaxGUIHelper, "min", 0.5, 50, 1).name("near").onChange(updateLight);
        folder2.add(minMaxGUIHelper, "max", 0.5, 50, 1).name("far").onChange(updateLight);
      }
      folder.add(light, "visible").onChange((visible) => {
        helper.visible = visible;
        cameraHelper.visible = visible;
      });
      folder.close();
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
      plane.receiveShadow = true; // 能被投射阴影
      scene.add(plane);

      const cubeSize = 4;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.set(cubeSize + 1, cubeSize / 2, 0);
      cube.receiveShadow = true; // 能被投射阴影
      cube.castShadow = true; // 能投射阴影
      scene.add(cube);

      const sphereRadius = 3;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
      const sphereMat = new THREE.MeshPhongMaterial({
        color: "#CA8",
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      sphere.receiveShadow = true; // 能被投射阴影
      sphere.castShadow = true; // 能投射阴影
      scene.add(sphere);
    }

    function render() {
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

// 物品和阴影 整体一起在x\z轴移动, 物品单独在y轴移动、阴影跟随物品变化
