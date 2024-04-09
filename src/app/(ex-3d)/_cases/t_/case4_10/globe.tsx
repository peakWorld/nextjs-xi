"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize, loadJSON } from "@/app/(ex-3d)/_utils/t_/common";
import "./index.scss";

export default function Case4_10() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const labelContainerElem = document.querySelector("#labels") as HTMLDivElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#236");

    const fov = 60;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2.5;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 4;
    controls.update();

    {
      const loader = new THREE.TextureLoader();
      const texture = loader.load("/t_/world/country-outlines-4k.png", render);
      const geometry = new THREE.SphereGeometry(1, 64, 32);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    let countryInfos: any;

    async function loadCountryData() {
      countryInfos = await loadJSON("/t_/world/country-info.json");

      // 经纬度辅助工具, 计算世界坐标
      const lonFudge = Math.PI * 1.5;
      const latFudge = Math.PI;
      const lonHelper = new THREE.Object3D();
      const latHelper = new THREE.Object3D();
      const positionHelper = new THREE.Object3D();
      positionHelper.position.z = 1;
      lonHelper.add(latHelper);
      latHelper.add(positionHelper);

      for (const countryInfo of countryInfos) {
        const { lat, lon, name } = countryInfo;
        // 偏移位置 + lon -180 ~ 180 / lat -90 ~ 90
        lonHelper.rotation.y = THREE.MathUtils.degToRad(lon) + lonFudge;
        latHelper.rotation.x = THREE.MathUtils.degToRad(lat) + latFudge;
        positionHelper.updateWorldMatrix(true, false);
        const position = new THREE.Vector3();
        positionHelper.getWorldPosition(position);
        countryInfo.position = position; // 每个country的世界坐标

        const elem = document.createElement("div");
        elem.textContent = name;
        labelContainerElem.appendChild(elem);
        countryInfo.elem = elem;
      }

      requestRenderIfNotRequested();
    }

    loadCountryData();

    const tempV = new THREE.Vector3();
    function updateLabels() {
      if (!countryInfos) {
        return;
      }
      // 每个country的世界坐标是不变的, 改变的只是相机 => 导致在屏幕位置发生改变
      // 这里不需要每次渲染都重新计算country的世界坐标 => 重新计算在屏幕的位置即可
      for (const countryInfo of countryInfos) {
        const { position, elem } = countryInfo;
        tempV.copy(position);
        tempV.project(camera);
        const x = (tempV.x * 0.5 + 0.5) * canvas.clientWidth;
        const y = (tempV.y * -0.5 + 0.5) * canvas.clientHeight;
        elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
        elem.style.zIndex = ((-tempV.z * 0.5 + 0.5) * 100000) | 0;
      }
    }

    let renderRequested = false;
    function render() {
      renderRequested = false;
      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      controls.update();
      updateLabels();

      renderer.render(scene, camera);
    }
    render();
    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
      }
    }
    controls.addEventListener("change", requestRenderIfNotRequested);
    window.addEventListener("resize", requestRenderIfNotRequested);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      labelContainerElem!.innerHTML = "";
      controls.removeEventListener("change", requestRenderIfNotRequested);
      window.removeEventListener("resize", requestRenderIfNotRequested);
    };
  }, []);

  return (
    <div id="container">
      <canvas ref={ref} className="w-full h-full block" />
      <div id="labels" className="order"></div>
    </div>
  );
}
