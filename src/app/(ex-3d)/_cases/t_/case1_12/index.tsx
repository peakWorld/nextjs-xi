"use client";

import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { wholeVertices, uniqueVertices } from "./data";

let useIndex = true; // 是否使用索引绘制

export default function Case1_10() {
  const ref = useRef<HTMLCanvasElement>(null);

  // 根据原生数组得到Gemo
  const oriArrGetGemo = useCallback(() => {
    const positions = [];
    const normals = [];
    const uvs = [];
    for (const vertex of useIndex ? uniqueVertices : wholeVertices) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }

    // 自定义缓冲几何体
    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents)); // 几何体-顶点坐标
    geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)); // 几何体-顶点法向量
    geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)); // 几何体-顶点纹理坐标

    if (useIndex) {
      geometry.setIndex([
        0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7, 8, 9, 10, 10, 9, 11, 12, 13, 14, 14, 13, 15, 16, 17, 18, 18, 17, 19, 20, 21,
        22, 22, 21, 23,
      ]);
    }

    return geometry;
  }, []);

  // 根据类型数组得到Gemo
  const typeArrGetGemo = useCallback(() => {
    const numVertices = uniqueVertices.length;
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    const positions = new Float32Array(numVertices * positionNumComponents); // 类型数组必须初始化数组大小
    const normals = new Float32Array(numVertices * normalNumComponents);
    const uvs = new Float32Array(numVertices * uvNumComponents);

    let posNdx = 0;
    let nrmNdx = 0;
    let uvNdx = 0;
    for (const vertex of uniqueVertices) {
      positions.set(vertex.pos, posNdx); // 类型数组赋值必须 设置位置
      normals.set(vertex.norm, nrmNdx);
      uvs.set(vertex.uv, uvNdx);
      posNdx += positionNumComponents;
      nrmNdx += normalNumComponents;
      uvNdx += uvNumComponents;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, positionNumComponents));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, normalNumComponents));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, uvNumComponents));

    geometry.setIndex([
      0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7, 8, 9, 10, 10, 9, 11, 12, 13, 14, 14, 13, 15, 16, 17, 18, 18, 17, 19, 20, 21,
      22, 22, 21, 23,
    ]);

    return geometry;
  }, []);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const fov = 60;
    const aspect = 1; // 默认canvas的宽高比
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 15);

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 0, 0);
    controls.update();

    const color = 0xffffff;
    const intensity = 2.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(3, 4, 5);
    scene.add(light);

    const loader = new THREE.TextureLoader();
    const texture = loader.load("/t_/star.png");
    texture.colorSpace = THREE.SRGBColorSpace;

    function makeInstance(geometry: THREE.BufferGeometry, color: number, x: number) {
      const material = new THREE.MeshPhongMaterial({ color, map: texture });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = x;
      scene.add(cube);
      return cube;
    }

    // const geometry = oriArrGetGemo();
    const geometry = typeArrGetGemo();

    const cubes = [
      makeInstance(geometry, 0x88ff88, 0),
      makeInstance(geometry, 0x8888ff, -4),
      makeInstance(geometry, 0xff8888, 4),
    ];

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
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
  }, [oriArrGetGemo, typeArrGetGemo]);

  return <canvas ref={ref} className="w-full h-full" />;
}
