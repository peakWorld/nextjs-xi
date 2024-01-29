"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { MinMaxGUIHelper } from "@/app/(ex-3d)/_utils/t_/helpers/index";
import "./index.scss";

export default function Case1_8() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const view1Elem = document.querySelector(".view1") as HTMLDivElement;
    const view2Elem = document.querySelector(".view2") as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const fov = 45;
    const aspect = 2; // 默认canvas的宽高比
    const near = 5;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const cameraHelper = new THREE.CameraHelper(camera);

    const gui = new GUI();
    gui.add(camera, "fov", 1, 180);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
    gui.add(minMaxGUIHelper, "min", 0.1, 100, 0.1).name("near");
    gui.add(minMaxGUIHelper, "max", 0.1, 100, 0.1).name("far");

    const controls = new OrbitControls(camera, view1Elem); // 相机控制器
    controls.target.set(0, 5, 0);
    controls.update();

    const camera2 = new THREE.PerspectiveCamera(
      60, // fov
      2, // aspect
      0.1, // near
      500 // far
    );
    camera2.position.set(40, 10, 30);
    camera2.lookAt(0, 5, 0);

    const controls2 = new OrbitControls(camera2, view2Elem);
    controls2.target.set(0, 5, 0);
    controls2.update();

    const scene = new THREE.Scene();
    scene.add(cameraHelper);

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

    function setScissorForElement(elem: HTMLDivElement) {
      const canvasRect = canvas.getBoundingClientRect();
      const elemRect = elem.getBoundingClientRect();

      const right =
        Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
      const left = Math.max(0, elemRect.left - canvasRect.left);
      const bottom =
        Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
      const top = Math.max(0, elemRect.top - canvasRect.top);

      const width = Math.min(canvasRect.width, right - left);
      const height = Math.min(canvasRect.height, bottom - top);

      const positiveYUpBottom = canvasRect.height - bottom - 30;
      renderer.setScissor(left, positiveYUpBottom, width, height);
      renderer.setViewport(left, positiveYUpBottom, width, height);

      return width / height;
    }

    function render() {
      resizeRendererToDisplaySize(renderer, canvas);
      renderer.setScissorTest(true);

      {
        const aspect = setScissorForElement(view1Elem);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        cameraHelper.update();
        cameraHelper.visible = false;
        scene.background = new THREE.Color(0x000000);
        renderer.render(scene, camera); // 主相机场景
      }

      {
        const aspect = setScissorForElement(view2Elem);
        camera2.aspect = aspect;
        camera2.updateProjectionMatrix();
        cameraHelper.visible = true;
        scene.background = new THREE.Color(0x000040);
        renderer.render(scene, camera2); // 辅摄像机观察主摄像机和主摄像机的视锥轮廓
      }
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      controls.dispose();
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return (
    <div className="wrap w-full h-full">
      <canvas ref={ref} className="w-full h-full" />
      <div className="split">
        <div className="view1" tabIndex={1}></div>
        <div className="view2" tabIndex={2}></div>
      </div>
    </div>
  );
}
