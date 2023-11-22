"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

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
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    // 1. ExtrudeGeometry
    const outline = new THREE.Shape(
      [
        [-2, -0.1],
        [2, -0.1],
        [2, 0.6],
        [1.6, 0.6],
        [1.6, 0.1],
        [-2, 0.1],
      ].map((p) => new THREE.Vector2(...p))
    );
    // const extrudeSettings = {
    //   steps: 100,
    //   bevelEnabled: false,
    //   extrudePath: shape,
    // };
    // const geometry = new THREE.ExtrudeGeometry(outline, extrudeSettings);

    function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

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
