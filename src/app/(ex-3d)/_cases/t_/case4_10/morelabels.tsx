"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
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
        const { lat, lon, name, max, min } = countryInfo;
        // 偏移位置 + lon -180 ~ 180 / lat -90 ~ 90
        lonHelper.rotation.y = THREE.MathUtils.degToRad(lon) + lonFudge;
        latHelper.rotation.x = THREE.MathUtils.degToRad(lat) + latFudge;
        positionHelper.updateWorldMatrix(true, false);
        const position = new THREE.Vector3();
        positionHelper.getWorldPosition(position);
        countryInfo.position = position; // 每个country的世界坐标

        // 计算每个国家的面积
        const width = max[0] - min[0];
        const height = max[1] - min[1];
        const area = width * height;
        countryInfo.area = area;

        const elem = document.createElement("div");
        elem.textContent = name;
        labelContainerElem.appendChild(elem);
        countryInfo.elem = elem;
      }

      requestRenderIfNotRequested();
    }

    loadCountryData();

    const settings = {
      minArea: 20,
      maxVisibleDot: -0.2,
    };
    const gui = new GUI({ width: 300 });
    gui.add(settings, "minArea", 0, 50).onChange(requestRenderIfNotRequested);
    gui.add(settings, "maxVisibleDot", -1, 1, 0.01).onChange(requestRenderIfNotRequested);

    const tempV = new THREE.Vector3();
    const cameraToPoint = new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    const normalMatrix = new THREE.Matrix3();
    const large = settings.minArea * settings.minArea;

    function updateLabels() {
      if (!countryInfos) {
        return;
      }
      normalMatrix.getNormalMatrix(camera.matrixWorldInverse); // 获取表示相机相对方向的变换矩阵
      camera.getWorldPosition(cameraPosition); // 获取相机的世界坐标

      for (const countryInfo of countryInfos) {
        const { position, elem, area } = countryInfo;

        // 问题解决 => 太多标签
        if (area < large) {
          elem.style.display = "none";
          continue;
        }

        // 问题解决 => 背面标签
        tempV.copy(position);
        tempV.applyMatrix3(normalMatrix);
        cameraToPoint.copy(position);
        cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();
        const dot = tempV.dot(cameraToPoint);
        if (dot > settings.maxVisibleDot) {
          elem.style.display = "none";
          continue;
        }
        elem.style.display = "";

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
      document.querySelector(".lil-gui")?.remove();
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
