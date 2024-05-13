"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { useMouse } from "@/app/(ex-3d)/_hooks/useMouse";
// import { PickByRay } from "@/app/(ex-3d)/_utils/t_/pickByRay";

interface Sizing {
  segmentHeight: number;
  segmentCount: number;
  height: number;
  halfHeight: number;
}

const canvasId = "case5_1_skin";

export default function Case5_1() {
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

    const fov = 75;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 200;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 30, 30);

    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    function addLight(...pos: Tuple<number, 3>) {
      const color = 0xffffff;
      const intensity = 2.5;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...pos);
      scene.add(light);
      scene.add(light.target);
    }

    addLight(0, 200, 0);
    addLight(100, 200, 100);
    addLight(-100, -200, -100);

    const segmentHeight = 8; // 每个小段的高度
    const segmentCount = 4; // 小段的数量
    const height = segmentHeight * segmentCount; // 总高度
    const halfHeight = height * 0.5; // 总高度的一半

    const sizing = {
      segmentHeight: segmentHeight,
      segmentCount: segmentCount,
      height: height,
      halfHeight: halfHeight,
    };

    function createGeometry(sizing: Sizing) {
      const totalCount = sizing.segmentCount * 3; // 小段再分段, 共有12个小分段
      const geometry = new THREE.CylinderGeometry(5, 5, sizing.height, 8, totalCount, true); // 以原点为中心
      const position = geometry.attributes.position;

      const vertex = new THREE.Vector3();
      const skinIndices = [];
      const skinWeights = [];

      for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);
        const y = vertex.y + sizing.halfHeight; // 将Y值转成正值

        const skinIndex = Math.floor(y / sizing.segmentHeight); // 计算小段的索引
        const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight; // 计算小段的权重<每个小段中再分成3个段>

        skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
        skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
      }
      geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
      geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));
      return geometry;
    }

    function createBones(sizing: Sizing) {
      let bones = [];

      let prevBone = new THREE.Bone(); // 第一个骨骼<rootBone>
      bones.push(prevBone);
      prevBone.position.y = -sizing.halfHeight;

      for (let i = 0; i < sizing.segmentCount; i++) {
        const bone = new THREE.Bone();
        bone.position.y = sizing.segmentHeight; // 将骨骼设置在两个分段的交接处
        bones.push(bone);
        prevBone.add(bone); // 以 前一个骨骼为相对坐标系, 添加当前骨骼
        prevBone = bone;
      }

      return bones;
    }

    function createMesh(geometry: THREE.BufferGeometry, bones: THREE.Bone[]) {
      const material = new THREE.MeshPhongMaterial({
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true,
      });

      const mesh = new THREE.SkinnedMesh(geometry, material);
      const skeleton = new THREE.Skeleton(bones); // 利用骨骼数组, 创建骨架<每个骨骼已确定父子关系>
      mesh.add(bones[0]); // 添加根骨骼<rootBone>
      mesh.bind(skeleton); // 绑定骨架

      const skeletonHelper = new THREE.SkeletonHelper(mesh);
      (skeletonHelper.material as any).linewidth = 2;
      scene.add(skeletonHelper);

      return mesh;
    }

    const geometry = createGeometry(sizing);
    const bones = createBones(sizing);
    const mesh = createMesh(geometry, bones);
    mesh.scale.multiplyScalar(1);
    scene.add(mesh);

    // const pickHelper = new PickByRay();

    function render(now: number) {
      now *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // pickHelper.pickObject(posRef.current, scene, camera, now);

      for (let i = 0; i < mesh.skeleton.bones.length; i++) {
        mesh.skeleton.bones[i].rotation.z = (Math.sin(now) * 2) / mesh.skeleton.bones.length;
      }

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

  return <canvas className="w-full h-full" id={canvasId} />;
}
