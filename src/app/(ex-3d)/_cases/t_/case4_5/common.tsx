"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import "./index.scss";

interface SceneInfo {
  scene: THREE.Scene;
  camera: THREE.Camera;
  controls: TrackballControls;
}

interface SceneElement {
  elem: HTMLElement;
  fn: (time: number, rect: DOMRect) => void;
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

    // 4. 缓存每个 virtual canvas 元素的渲染函数
    const sceneElements: SceneElement[] = [];
    function addScene(elem: HTMLElement, fn: (time: number, rect: DOMRect) => void) {
      sceneElements.push({ elem, fn });
    }

    // 3. 构建场景
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
      scene.add(camera);

      const controls = new TrackballControls(camera, elem);
      controls.noZoom = true;
      controls.noPan = true;

      {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        camera.add(light);
      }

      return { scene, camera, controls };
    }

    // 2. 每个场景的设置函数
    const sceneInitFunctionsByName = {
      box: (elem: HTMLElement) => {
        const { scene, camera, controls } = makeScene(elem);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: "red" });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        // 返回渲染函数
        return (time: number, rect: DOMRect) => {
          mesh.rotation.y = time * 0.1;
          camera.aspect = rect.width / rect.height;
          camera.updateProjectionMatrix();
          controls.handleResize();
          controls.update();
          renderer.render(scene, camera);
        };
      },
      pyramid: (elem: HTMLElement) => {
        const { scene, camera, controls } = makeScene(elem);
        const radius = 0.8;
        const widthSegments = 4;
        const heightSegments = 2;
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshPhongMaterial({
          color: "blue",
          flatShading: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        return (time: number, rect: DOMRect) => {
          mesh.rotation.y = time * 0.1;
          camera.aspect = rect.width / rect.height;
          camera.updateProjectionMatrix();
          controls.handleResize();
          controls.update();
          renderer.render(scene, camera);
        };
      },
    };

    // 1. 读取页面中所有的 virtual canvas 元素, 并初始化场景
    document.querySelectorAll<HTMLElement>("[data-diagram]").forEach((elem) => {
      const sceneName = elem.dataset.diagram;
      const sceneInitFunction = sceneInitFunctionsByName[sceneName as "box"];
      const sceneRenderFunction = sceneInitFunction(elem);
      addScene(elem, sceneRenderFunction);
    });

    let clearColor = "#fff";
    function render(time: number) {
      time *= 0.001;

      resizeRendererToDisplaySize(renderer, canvas);

      renderer.setScissorTest(false);
      renderer.setClearColor(clearColor, 0);
      renderer.clear(true, true);
      renderer.setScissorTest(true);

      const transform = `translateY(${window.scrollY}px)`;
      renderer.domElement.style.transform = transform;
      const canvasRect = canvas.getBoundingClientRect();

      // 5. 每一帧处理 virtual canvas 元素渲染函数
      for (const { elem, fn } of sceneElements) {
        const rect = elem.getBoundingClientRect();
        const { left, right, top, bottom, width, height } = rect;

        const isOffscreen =
          left >= canvasRect.right || right <= canvasRect.left || top >= canvasRect.bottom || bottom <= canvasRect.top;

        if (!isOffscreen) {
          const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
          const rightLeft = left - canvasRect.left;
          renderer.setScissor(rightLeft, positiveYUpBottom, width, height);
          renderer.setViewport(rightLeft, positiveYUpBottom, width, height);

          fn(time, rect);
        }
      }

      requestAnimationFrame(render);
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
        <span data-diagram="box" className="left"></span>
        {`I love boxes. Presents come in boxes. When I find a new box I'm
        always excited to find out what's inside.`}
      </p>
      <p>
        <span data-diagram="pyramid" className="right"></span>
        When I was a kid I dreamed of going on an expedition inside a pyramid and finding a undiscovered tomb full of
        mummies and treasure.
      </p>
    </div>
  );
}
