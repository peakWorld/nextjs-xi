"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import createExtrudeMesh from "./extrudeGeometry";
import createLatheMesh from "./latheGeometry";
import createTextMesh from "./textGeometry";
import createTubeMesh from "./tubeGeometry";
import { createEdgesLine, createWireframeLine } from "./edgesOrWireframeGeometry";
import { creatCubicBezierCurve3Line } from "./line";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case1_3() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const gui = new GUI();
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

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 0, 0);
    controls.update();

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    // 1. ExtrudeGeometry => 将一个二维形状挤出为一个三维几何体。
    const extrude = createExtrudeMesh();
    extrude.visible = false;
    scene.add(extrude);
    gui
      .add({ visible: false }, "visible")
      .name("ExtrudeGeometry")
      .onChange((flag) => {
        extrude.visible = flag;
      });

    // 1_1 三维三次贝塞尔曲线
    const cubic = creatCubicBezierCurve3Line();
    cubic.visible = false;
    scene.add(cubic);
    gui
      .add({ visible: false }, "visible")
      .name("CubicBezierCurve3Line")
      .onChange((flag) => {
        cubic.visible = flag;
      });

    // 2. LatheGeometry => 创建具有轴对称性的网格，绕着Y轴来进行旋转。
    const lathe = createLatheMesh();
    lathe.visible = false;
    scene.add(lathe);
    gui
      .add({ visible: false }, "visible")
      .name("LatheGeometry")
      .onChange((flag) => {
        lathe.visible = flag;
        camera.position.z = 40;
      });

    // 3. TextGeometry => 文本
    createTextMesh().then((mesh) => {
      mesh.visible = false;
      scene.add(mesh);

      gui
        .add({ visible: false }, "visible")
        .name("TextGeometry")
        .onChange((flag) => {
          mesh.visible = flag;
        });
    });

    // 4. TubeGeometry => 将一个三维曲线构建为管道。
    const tube = createTubeMesh();
    tube.visible = false;
    scene.add(tube);
    gui
      .add({ visible: false }, "visible")
      .name("TubeGeometry")
      .onChange((flag) => {
        tube.visible = flag;
      });

    // 5. EdgesGeometry => 辅助查看geometry的边缘
    const edges = createEdgesLine();
    edges.visible = false;
    scene.add(edges);
    gui
      .add({ visible: false }, "visible")
      .name("EdgesGeometry")
      .onChange((flag) => {
        edges.visible = flag;
      });

    // 6. WireframeGeometry
    const wire = createWireframeLine();
    wire.visible = false;
    scene.add(wire);
    gui
      .add({ visible: false }, "visible")
      .name("WireframeGeometry")
      .onChange((flag) => {
        wire.visible = flag;
      });

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      scene.traverse((e) => {
        if (e instanceof THREE.Mesh) {
          e.rotation.x = time;
          e.rotation.y = time;
          e.rotation.z = time;
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
