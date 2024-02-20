"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Case1_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    // webgl渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    // 2. 场景
    const scene = new THREE.Scene();

    // 3. 相机
    const fov = 75;
    const aspect = canvas.offsetWidth / canvas.offsetHeight;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2; // 摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。

    // 4. 平行光(方向、光色、强度)
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4); // 默认指向原点, 通过改变target/position来修改光照方向
    scene.add(light);

    // 5. 网格
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth); // 5.1 几何体
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // 5.2 材质
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 8. 创建网格(相同几何体/多种材质)
    function makeCube(geometry: THREE.BoxGeometry, color: number, x: number) {
      const material = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      cube.position.x = x;
      return cube;
    }
    const cubes = [makeCube(geometry, 0x8844aa, -2), makeCube(geometry, 0xaa8844, 2)];

    // 7. 动画
    function render(time: number) {
      time *= 0.001; // 将时间单位变为秒

      cube.rotation.x = time; // 弧度制: 一圈的弧度为2Π,则旋转一周的时间为6.28s。
      cube.rotation.y = time;

      cubes.forEach((it, ndx) => {
        const speed = 1 + ndx * 0.2;
        const rot = time * speed;
        it.rotation.x = rot;
        it.rotation.y = rot;
      });

      // 6. 渲染
      renderer.render(scene, camera);
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
    };
  }, []);

  return <canvas className="w-full h-full" ref={ref} />;
}
