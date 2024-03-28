"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import "./index.scss";

interface SceneInfo {
  scene: THREE.Scene;
  camera: THREE.Camera;
  elem: HTMLElement;
  mesh?: THREE.Mesh;
}

export default function Case4_5() {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    // 构建场景
    function makeScene(elem: HTMLElement): SceneInfo {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("red");

      const fov = 45;
      const aspect = 2; // the canvas default
      const near = 0.1;
      const far = 5;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 2;
      camera.position.set(0, 1, 2);
      camera.lookAt(0, 0, 0);

      {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
      }

      return { scene, camera, elem };
    }

    function setupScene1() {
      const sceneInfo = makeScene(document.querySelector("#box") as HTMLElement);
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({ color: "red" });
      const mesh = new THREE.Mesh(geometry, material);
      sceneInfo.scene.add(mesh);
      sceneInfo.mesh = mesh;
      return sceneInfo;
    }

    function setupScene2() {
      const sceneInfo = makeScene(document.querySelector("#pyramid") as HTMLElement);
      const radius = 0.8;
      const widthSegments = 4;
      const heightSegments = 2;
      const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
      const material = new THREE.MeshPhongMaterial({
        color: "blue",
      });
      const mesh = new THREE.Mesh(geometry, material);
      sceneInfo.scene.add(mesh);
      sceneInfo.mesh = mesh;
      return sceneInfo;
    }

    const sceneInfo1 = setupScene1();
    const sceneInfo2 = setupScene2();

    function renderSceneInfo(sceneInfo: SceneInfo) {
      const { scene, camera, elem } = sceneInfo;

      const canvasRect = canvas.getBoundingClientRect(); // 左上角为原点
      const { left, right, top, bottom, width, height } = elem.getBoundingClientRect();

      const isOffscreen =
        left >= canvasRect.right || right <= canvasRect.left || top >= canvasRect.bottom || bottom <= canvasRect.top;

      if (isOffscreen) {
        return;
      }

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // 坐标尺寸转化计算
      const positiveYUpBottom = canvasRect.height - bottom;
      const rightLeft = left - canvasRect.left;

      renderer.setScissor(rightLeft, positiveYUpBottom, width, height);
      renderer.setViewport(rightLeft, positiveYUpBottom, width, height); // 左下角为原点

      renderer.render(scene, camera);
    }

    function render(time: number) {
      time *= 0.001;

      // canvas时在所有元素之下的, 对应展示区域的元素不能设置背景色
      // 重：页面滚动 => canvas跟随滚动, 3d场景与展示区域对齐
      const transform = `translateY(${window.scrollY}px)`;
      renderer.domElement.style.transform = transform;

      resizeRendererToDisplaySize(renderer, canvas);

      renderer.setScissorTest(false);
      renderer.clear(true, true);
      renderer.setScissorTest(true); // 启用剪裁检测

      sceneInfo1.mesh!.rotation.y = time * 0.5;
      sceneInfo2.mesh!.rotation.y = time * 0.5;

      renderSceneInfo(sceneInfo1);
      renderSceneInfo(sceneInfo2);

      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="case4_5_index w-full h-full">
      <canvas ref={ref} className="w-full h-full" />
      <p>
        <span id="box" className="diagram left"></span>
        {`I love boxes. Presents come in boxes. When I find a new box I'm
        always excited to find out what's inside.`}
      </p>
      <p>
        <span id="pyramid" className="diagram right"></span>
        When I was a kid I dreamed of going on an expedition inside a pyramid and finding a undiscovered tomb full of
        mummies and treasure.
      </p>
    </div>
  );
}
