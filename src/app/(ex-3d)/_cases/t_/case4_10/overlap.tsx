"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
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

    const fov = 75;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 7;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    function makeInstance(geometry: THREE.BoxGeometry, color: number, x: number, name: string) {
      const material = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      cube.position.x = x;

      // 每个cube设置对应的 标签元素
      const elem = document.createElement("div") as HTMLDivElement;
      elem.textContent = name;
      labelContainerElem.appendChild(elem);

      return { cube, elem };
    }

    const cubes = [
      makeInstance(geometry, 0x44aa88, 0, "Aqua"),
      makeInstance(geometry, 0x8844aa, -2, "Purple"),
      makeInstance(geometry, 0xaa8844, 2, "Gold"),
    ];

    const tempV = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cubeInfo, ndx) => {
        const { cube, elem } = cubeInfo;

        const speed = 1 + ndx * 0.2;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;

        /*** 在渲染时定位Label元素 **/

        // 1. 获取立方体中心的位置
        cube.updateWorldMatrix(true, false);
        cube.getWorldPosition(tempV);

        // 2. 获取标准化屏幕坐标，x和y都会在-1和1区间
        // x = -1 表示在最左侧
        // y = -1 表示在最底部
        tempV.project(camera);
        if (tempV.z > 1) {
          console.log("tempV", tempV);
        }

        // 3.调用Raycast获取所有相交的物体; 如果第一个相交的是此物体，那么就是可见的
        // 解决问题 => 重叠对象
        raycaster.setFromCamera(new THREE.Vector2(tempV.x, tempV.y), camera);
        const intersectedObjects = raycaster.intersectObjects(scene.children);
        const show = cube === intersectedObjects[0]?.object;

        // 解决问题[不正确] => 超出视锥体范围
        if (!show || Math.abs(tempV.z) > 1) {
          // 隐藏Label
          elem.style.display = "none";
        } else {
          // 显示Label
          elem.style.display = "";

          // 4. 将标准屏幕坐标转化为CSS坐标
          const x = (tempV.x * 0.5 + 0.5) * canvas.clientWidth;
          const y = (tempV.y * -0.5 + 0.5) * canvas.clientHeight;

          // 5. 将元素移动到此位置
          elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
        }
      });

      renderer.render(scene, camera);
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      labelContainerElem!.innerHTML = "";
    };
  }, []);

  return (
    <div id="container">
      <canvas ref={ref} className="w-full h-full block" />
      <div id="labels"></div>
    </div>
  );
}
