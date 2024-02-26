"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import ClearingLogger from "./logger";
import "./index.scss";

interface Thing {
  mesh: THREE.Mesh;
  timer: number;
  velocity: THREE.Vector3;
}

export default function Case2_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("cyan");

    const fov = 75;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 30;

    function rand(min: number, max: number) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return Math.random() * (max - min) + min;
    }

    const things: Thing[] = [];
    const geometry = new THREE.SphereGeometry();

    const info = canvas.getBoundingClientRect();

    function createThing(evt: MouseEvent) {
      const x = ((evt.clientX - info.left) / info.width) * 2 - 1;
      const y = -((evt.clientY - info.top) / info.height) * 2 + 1;
      // let stand = new THREE.Vector4(x, y, 0, 1.0); // 将标准化坐标转到世界坐标
      // stand = stand.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorldInverse);
      // console.log("stand", stand);

      const material = new THREE.MeshBasicMaterial({ color: new THREE.Color() });
      material.color.setHSL(Math.random(), 1, 0.25);
      const mesh = new THREE.Mesh(geometry, material);
      // mesh.position.set(stand.x, stand.y, stand.z);

      scene.add(mesh);
      things.push({
        mesh,
        timer: 2,
        velocity: new THREE.Vector3(rand(-5, 5), rand(-5, 5), rand(-5, 5)),
      });
    }

    canvas.addEventListener("click", createThing);

    const logger = new ClearingLogger(document.querySelector("#debug pre") as HTMLElement);

    let then = 0;
    function render(now: number) {
      now *= 0.001;
      const deltaTime = now - then;
      then = now;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      logger.log("fps:", (1 / deltaTime).toFixed(1));
      logger.log("num things:", things.length);

      for (let i = 0; i < things.length; ) {
        const thing = things[i];
        const mesh = thing.mesh;
        const pos = mesh.position;
        logger.log("timer:", thing.timer.toFixed(3), "pos:", pos.x.toFixed(3), pos.y.toFixed(3), pos.z.toFixed(3));
        thing.timer -= deltaTime;
        if (thing.timer <= 0) {
          things.splice(i, 1);
          scene.remove(mesh);
        } else {
          mesh.position.addScaledVector(thing.velocity, deltaTime);
          ++i;
        }
      }

      renderer.render(scene, camera);
      logger.render();
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
      canvas.removeEventListener("click", createThing);
    };
  }, []);

  return (
    <div className="wrap-case w-full h-full">
      <canvas ref={ref} className="w-full h-full" />
      <div className="debug" id="debug">
        <pre></pre>
      </div>
    </div>
  );
}
