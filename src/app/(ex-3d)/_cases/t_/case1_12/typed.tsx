"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case1_10() {
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
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 3;

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 0, 0);
    controls.update();

    function addLight(...pos: number[]) {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(pos[0], pos[1], pos[2]);
      scene.add(light);
    }
    addLight(-1, 2, 4);
    addLight(2, -2, 3);

    function makeSpherePositions(segmentsAround: number, segmentsDown: number) {
      const numVertices = segmentsAround * segmentsDown * 6;
      const numComponents = 3;
      const positions = new Float32Array(numVertices * numComponents);
      const indices = [];

      // 辅助获取球面点的坐标
      const longHelper = new THREE.Object3D();
      const latHelper = new THREE.Object3D();
      const pointHelper = new THREE.Object3D();
      longHelper.add(latHelper);
      latHelper.add(pointHelper);
      pointHelper.position.z = 1;
      const temp = new THREE.Vector3();

      // 将默认(0, 0, 1)的点 依次x轴旋转、y轴旋转; 再全局变换得到世界坐标
      function getPoint(lat: number, long: number) {
        latHelper.rotation.x = lat; // 按x轴旋转 纬度值
        longHelper.rotation.y = long; // 按y轴旋转 经度值
        longHelper.updateMatrixWorld(true); // 默认点(0,0,1)经过旋转后得到世界坐标
        return pointHelper.getWorldPosition(temp).toArray();
      }

      // 计算每个球面点的经纬度值
      let posNdx = 0;
      let ndx = 0;
      for (let down = 0; down < segmentsDown; ++down) {
        const v0 = down / segmentsDown;
        const v1 = (down + 1) / segmentsDown;
        const lat0 = (v0 - 0.5) * Math.PI;
        const lat1 = (v1 - 0.5) * Math.PI;

        for (let across = 0; across < segmentsAround; ++across) {
          const u0 = across / segmentsAround;
          const u1 = (across + 1) / segmentsAround;
          const long0 = u0 * Math.PI * 2;
          const long1 = u1 * Math.PI * 2;

          positions.set(getPoint(lat0, long0), posNdx);
          posNdx += numComponents;
          positions.set(getPoint(lat1, long0), posNdx);
          posNdx += numComponents;
          positions.set(getPoint(lat0, long1), posNdx);
          posNdx += numComponents;
          positions.set(getPoint(lat1, long1), posNdx);
          posNdx += numComponents;

          indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3);
          ndx += 4;
        }
      }

      return { positions, indices };
    }

    const segmentsAround = 24;
    const segmentsDown = 16;
    const { positions, indices } = makeSpherePositions(segmentsAround, segmentsDown);
    const normals = positions.slice(); // 每个球面点的法线 即原点到坐标本身的向量

    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const positionAttribute = new THREE.BufferAttribute(positions, positionNumComponents);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", positionAttribute);
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, normalNumComponents));
    geometry.setIndex(indices);

    function makeInstance(geometry: THREE.BufferGeometry, color: number, x: number) {
      const material = new THREE.MeshPhongMaterial({
        color,
        side: THREE.DoubleSide,
        shininess: 100,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = x;
      scene.add(cube);
      return cube;
    }

    const cubes = [
      // makeInstance(geometry, 0xff0000, -2),
      makeInstance(geometry, 0x00ff00, 0),
    ];

    const temp = new THREE.Vector3();
    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // 动态更新顶点数据
      for (let i = 0; i < positions.length; i += 3) {
        const quad = (i / 12) | 0;
        const ringId = (quad / segmentsAround) | 0;
        const ringQuadId = quad % segmentsAround;
        const ringU = ringQuadId / segmentsAround;
        const angle = ringU * Math.PI * 2;
        temp.fromArray(normals, i);
        temp.multiplyScalar(THREE.MathUtils.lerp(1, 1.4, Math.sin(time + ringId + angle) * 0.5 + 0.5)); // 线性插值[1,1.4]
        temp.toArray(positions, i);
      }
      positionAttribute.needsUpdate = true; //  标记顶点缓冲区数据已更新

      cubes.forEach((cube, ndx) => {
        const speed = -0.2 + ndx * 0.1;
        const rot = time * speed;
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
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
