"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import AxisGridHelper from "@/app/(ex-3d)/_utils/t_/helpers/axisGrid";

export default function Case1_4() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const gui = new GUI();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const fov = 40;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    // 中心点光源(模拟太阳光)
    const color = 0xffffff;
    const intensity = 500;
    const pointlight = new THREE.PointLight(color, intensity);
    scene.add(pointlight);

    // 要更新旋转角度的对象数组
    const objects: THREE.Object3D[] = [];

    // 一球多用
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    // 空白场景对象 日、地
    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    objects.push(solarSystem);

    // 太阳
    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffff00,
    });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // 影响局部空间中的所有子元素
    solarSystem.add(sunMesh);
    objects.push(sunMesh);

    // 空白场景对象 地、月
    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);

    // 地球
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthOrbit.add(earthMesh);
    objects.push(earthMesh);

    // 空白场景对象 月
    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    // 月球
    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);

    // 添加辅助模块
    // objects.forEach((e) => {
    //   const axes = new THREE.AxesHelper();
    //   (axes.material as THREE.Material).depthTest = false; // 关闭深度测试, 不会检查其是否在其他东西后面进行绘制
    //   axes.renderOrder = 1; // 调整绘制顺序, 会在所有球体之后被绘制
    //   e.add(axes);
    // });

    function makeAxisGrid(node: THREE.Object3D, label: string, units?: number) {
      const helper = new AxisGridHelper(node, units);
      gui.add(helper, "visible").name(label);
    }

    makeAxisGrid(solarSystem, "solarSystem", 25);
    makeAxisGrid(sunMesh, "sunMesh");
    makeAxisGrid(earthOrbit, "earthOrbit");
    makeAxisGrid(earthMesh, "earthMesh");
    makeAxisGrid(moonOrbit, "moonOrbit");
    makeAxisGrid(moonMesh, "moonMesh");

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      objects.forEach((e) => {
        // e.rotation.y = time;
      });

      renderer.render(scene, camera);
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
