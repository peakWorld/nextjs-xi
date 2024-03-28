"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize, rand, randomColor } from "@/app/(ex-3d)/_utils/t_/common";
import { useMouse } from "@/app/(ex-3d)/_hooks/useMouse";
import { PickByRay } from "@/app/(ex-3d)/_utils/t_/pickByRay";

const canvasId = "case4_6_index";

export default function Case4_6() {
  const posRef = useMouse(canvasId);

  useEffect(() => {
    let timer = -1;
    const canvas = document.querySelector(`#${canvasId}`) as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const fov = 60;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 200;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 30;

    // 把摄像机放到自拍杆上 (把它添加为一个对象的子元素)
    // 自拍杆的位置基于scene的坐标系, 且自拍杆的旋转会带动相机旋转
    const cameraPole = new THREE.Object3D();
    scene.add(cameraPole);
    cameraPole.add(camera);

    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      camera.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // const loader = new THREE.TextureLoader();
    // const texture = loader.load("/t_/frame.png");

    const numObjects = 100;
    for (let i = 0; i < numObjects; ++i) {
      const material = new THREE.MeshPhongMaterial({
        color: randomColor(),
      });

      // 透明孔洞纹理 => 无法透过孔洞拾取后面物体
      // const material = new THREE.MeshPhongMaterial({
      //   color: randomColor(),
      //   map: texture,
      //   transparent: true,
      //   side: THREE.DoubleSide,
      //   alphaTest: 0.1,
      // });

      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
      cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
      cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
    }

    const pickHelper = new PickByRay();

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // 效果: 相机沿着Y轴移动
      cameraPole.rotation.y = time * 0.1;

      // 拾取物体
      pickHelper.pick(posRef.current, scene, camera, time);

      renderer.render(scene, camera);
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
    };
  }, []);

  return <canvas id={canvasId} className="w-full h-full" />;
}
