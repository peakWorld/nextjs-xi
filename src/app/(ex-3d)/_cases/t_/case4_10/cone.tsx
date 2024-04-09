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
    camera.position.z = 15;

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

    function makeInstance(size: number, color: number, x: number, name: string) {
      const geometry = new THREE.BoxGeometry(size, size, size);
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
      makeInstance(3, 0x44aa88, 0, "Aqua"),
      makeInstance(3, 0x8844aa, -5, "Purple"),
      makeInstance(15, 0xaa8844, 10, "Gold"),
    ];

    const tempV = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const frustum = new THREE.Frustum();
    const viewProjection = new THREE.Matrix4();

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

        // cube.updateWorldMatrix(true, false); // 其实cube的世界坐标没有改变, 可注释
        cube.getWorldPosition(tempV);
        tempV.project(camera);

        // 解决问题 => 重叠对象
        raycaster.setFromCamera(new THREE.Vector2(tempV.x, tempV.y), camera);
        const intersectedObjects = raycaster.intersectObjects(scene.children);
        const show = cube === intersectedObjects[0]?.object;

        // 解决问题 => 检查对象是否在视锥体中
        viewProjection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); // 投影矩阵 x 视图矩阵
        frustum.setFromProjectionMatrix(viewProjection);
        const inFrustum = frustum.intersectsObject(cube);

        if (!show || !inFrustum) {
          elem.style.display = "none";
        } else {
          elem.style.display = "";
          const x = (tempV.x * 0.5 + 0.5) * canvas.clientWidth;
          const y = (tempV.y * -0.5 + 0.5) * canvas.clientHeight;
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
