"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import "./outside.scss";

interface SceneInfo {
  scene: THREE.Scene;
  camera: THREE.Camera;
  controls: TrackballControls;
}

interface SceneElement {
  elem: HTMLElement;
  fn: (time: number, rect: DOMRect) => void;
  ctx: CanvasRenderingContext2D;
}

export default function Case4_5() {
  useLayoutEffect(() => {
    let timer = -1;
    // 真正渲染场景的元素, 大小在render函数中跟随指定元素改变
    // 渲染的场景, 拷贝到对应2d canvas上
    const canvas = document.createElement("canvas");

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas,
    });
    renderer.setScissorTest(true);

    const sceneElements: SceneElement[] = [];
    function addScene(elem: HTMLElement, fn: (time: number, rect: DOMRect) => void) {
      const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
      elem.appendChild(ctx!.canvas);
      sceneElements.push({ elem, ctx, fn });
    }

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

    const sceneInitFunctionsByName = {
      box: (elem: HTMLElement) => {
        const { scene, camera, controls } = makeScene(elem);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: "red" });
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

    document.querySelectorAll<HTMLElement>("[data-diagram]").forEach((elem) => {
      const sceneName = elem.dataset.diagram;
      const sceneInitFunction = sceneInitFunctionsByName[sceneName as "box"];
      const sceneRenderFunction = sceneInitFunction(elem);
      addScene(elem, sceneRenderFunction);
    });

    function render(time: number) {
      time *= 0.001;

      for (const { elem, fn, ctx } of sceneElements) {
        const rect = elem.getBoundingClientRect();
        const { left, right, top, bottom, width, height } = rect;
        const rendererCanvas = renderer.domElement;

        const isOffscreen = bottom < 0 || top > window.innerHeight || right < 0 || left > window.innerWidth;

        if (!isOffscreen) {
          if (rendererCanvas.width < width || rendererCanvas.height < height) {
            renderer.setSize(width, height, false);
          }

          if (ctx.canvas.width !== width || ctx.canvas.height !== height) {
            ctx.canvas.width = width;
            ctx.canvas.height = height;
          }

          renderer.setScissor(0, 0, width, height);
          renderer.setViewport(0, 0, width, height);

          fn(time, rect);

          // 将场景的渲染结果 拷贝到2D canvas上
          ctx.globalCompositeOperation = "copy";
          ctx.drawImage(rendererCanvas, 0, rendererCanvas.height - height, width, height, 0, 0, width, height);
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
    <div className="case4_5_outside w-full h-full">
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
