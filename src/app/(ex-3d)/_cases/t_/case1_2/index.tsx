"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Case1_2() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const fov = 75;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeCube(geometry: THREE.BoxGeometry, color: number, x: number) {
      const material = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      cube.position.x = x;
      return cube;
    }

    const cubes = [makeCube(geometry, 0x8844aa, -2), makeCube(geometry, 0x44aa88, 0), makeCube(geometry, 0xaa8844, 2)];

    // 2. 立方体模糊(修改canvas分辨率)
    function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height; // 像素尺寸不等于显示尺寸, 才更新
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer)) {
        // 1. 立方体拉伸(修正视口宽高比)
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((it, ndx) => {
        const speed = 1 + ndx * 0.2;
        const rot = time * speed;
        it.rotation.x = rot;
        it.rotation.y = rot;
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

  return (
    <div>
      天可是地道的过年哦，大年初一，一大早妈妈就叫我起床了，可是因为我昨天晚上守岁，
      <canvas ref={ref} className="w-52 h-52 float-left" />
      所以特别留恋哪温暖的小床，最后在妈妈的催促声中我不情愿的起床了。其实早上我最喜欢的一件事就是收红包了，虽然都要“交公”，但是我特喜欢那感觉，(*^__^*)…嘻嘻。老爸老妈要去爬山了，叫我一起去，可是我不想去，因为老师说过如果长辈叫你们去爬山之类的都别去，所以我只好忍痛割爱了。(怕上山被老师看到)，妈妈对我唠叨了几句便和老爸去二人世界了。我呆在家里，不一会儿肚子就在打鼓了，早知道早上吃饱点了，于是我得到老妈的允许，开始煮我最拿手的快速面了，打下两个鸡蛋，嗯，真香，口水到处流了，…嘻嘻，好了，我要吃面了，拜拜。
    </div>
  );
}
