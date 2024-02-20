"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case1_8() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });
    const scene = new THREE.Scene();

    // 原点在左上角，模拟2D canvas
    const left = 0;
    const right = canvas.width;
    const top = 0;
    const bottom = canvas.height;
    const near = -1;
    const far = 1;
    const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera.zoom = 1;

    const loader = new THREE.TextureLoader();
    const textures = [
      loader.load("/t_/flowers/flower-1.jpg"),
      loader.load("/t_/flowers/flower-2.jpg"),
      loader.load("/t_/flowers/flower-3.jpg"),
      loader.load("/t_/flowers/flower-4.jpg"),
      loader.load("/t_/flowers/flower-5.jpg"),
      loader.load("/t_/flowers/flower-6.jpg"),
    ];
    const planeSize = 256;
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planes = textures.map((texture) => {
      const planePivot = new THREE.Object3D(); // 中心位于原点(0,0,0)
      scene.add(planePivot);
      texture.magFilter = THREE.NearestFilter;
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      planePivot.add(mesh);
      mesh.position.set(planeSize / 2, planeSize / 2, 0); // 确保mesh在屏幕内, z轴值0、符合正交相机[-1,1]空间
      return planePivot;
    });

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.right = canvas.width;
        camera.bottom = canvas.height;
        camera.updateProjectionMatrix();
      }

      const distAcross = Math.max(20, canvas.width - planeSize);
      const distDown = Math.max(20, canvas.height - planeSize);
      // 来回运动的总距离
      const xRange = distAcross * 2;
      const yRange = distDown * 2;
      const speed = 180;

      planes.forEach((plane, ndx) => {
        // 为每个平面单独计算时间
        const t = time * speed + ndx * 300;
        // 在0到最远距离之间获取一个值
        const xt = t % xRange;
        const yt = t % yRange;
        // 0到距离的一半, 向前运动；另一半的时候往回运动
        const x = xt < distAcross ? xt : xRange - xt;
        const y = yt < distDown ? yt : yRange - yt;
        plane.position.set(x, y, 0);
      });

      renderer.render(scene, camera);
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
