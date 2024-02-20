"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import createExtrudeMesh from "./extrudeGeometry";
import createLatheMesh from "./latheGeometry";
import createTextMesh from "./textGeometry";
import createTubeMesh from "./tubeGeometry";
import { createEdgesLine, createWireframeLine } from "./edgesOrWireframeGeometry";
import { creatCubicBezierCurve3Line } from "./line";
export default function Case1_3() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    const fov = 75;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 12;
    // camera.position.set(2, 1, 5);

    // const axesHelper = new THREE.AxesHelper(10);
    // scene.add(axesHelper);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    // 1. ExtrudeGeometry => 将一个二维形状挤出为一个三维几何体。
    scene.add(createExtrudeMesh());
    // camera.position.z = 12;
    // 1_1 三维三次贝塞尔曲线
    // scene.add(creatCubicBezierCurve3Line());

    // 2. LatheGeometry => 创建具有轴对称性的网格，绕着Y轴来进行旋转。
    // scene.add(createLatheMesh());
    // camera.position.z = 40;

    // 3. TextGeometry => 文本
    // createTextMesh().then((mesh) => scene.add(mesh));

    // 4. TubeGeometry => 将一个三维曲线构建为管道。
    // scene.add(createTubeMesh());

    // 5. EdgesGeometry => 辅助查看geometry的边缘
    // scene.add(createEdgesLine());

    // 6. WireframeGeometry
    // scene.add(createWireframeLine());

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // scene.traverse((e) => {
      //   if (e instanceof THREE.Mesh) {
      //     e.rotation.x = time;
      //     e.rotation.y = time;
      //     e.rotation.z = time;
      //   }
      // });

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
