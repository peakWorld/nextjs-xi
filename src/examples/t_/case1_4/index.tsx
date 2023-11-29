"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "../utils";
export default function Case1_3() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const fov = 75;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    // 要更新旋转角度的对象数组
    const objects: THREE.Mesh[] = [];

    // 一球多用
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    // 太阳
    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // 影响局部空间中的所有子元素
    scene.add(sunMesh);

    // 中心点光源(模拟太阳光)
    const color = 0xffffff;
    const intensity = 3;
    const pointlight = new THREE.PointLight(color, intensity);
    scene.add(pointlight);

    // 地球
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.position.x = 10;
    scene.add(earthMesh);
    objects.push(earthMesh);
    sunMesh.add(earthMesh);

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      objects.forEach((e) => {
        if (e instanceof THREE.Mesh) {
          e.rotation.y = time;
        }
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
