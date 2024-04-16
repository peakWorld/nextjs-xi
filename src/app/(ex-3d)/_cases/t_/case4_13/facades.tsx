"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case4_13() {
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
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 2, 5);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 2, 0);
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    function addLight(position: [number, number, number]) {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...position);
      scene.add(light);
      scene.add(light.target);
    }

    addLight([-3, 1, 1]);
    addLight([2, 1, 0.5]);

    const trunkRadius = 0.2;
    const trunkHeight = 1;
    const trunkRadialSegments = 12;
    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments);

    const topRadius = trunkRadius * 4;
    const topHeight = trunkHeight * 2;
    const topSegments = 12;
    const topGeometry = new THREE.ConeGeometry(topRadius, topHeight, topSegments);

    const trunkMaterial = new THREE.MeshPhongMaterial({ color: "brown" });
    const topMaterial = new THREE.MeshPhongMaterial({ color: "green" });

    function makeTree(x: number, z: number) {
      const root = new THREE.Object3D();
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = trunkHeight / 2;
      root.add(trunk);

      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = trunkHeight + topHeight / 2;
      root.add(top);

      root.position.set(x, 0, z);
      scene.add(root);

      return root;
    }

    function frameArea(sizeToFitOnScreen: number, boxSize: number, boxCenter: THREE.Vector3, camera: THREE.Camera) {
      const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
      const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
      const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

      camera.position.copy(boxCenter);
      camera.position.z += distance;

      camera.near = boxSize / 100;
      camera.far = boxSize * 100;

      camera.updateProjectionMatrix();
    }

    function makeSpriteTexture(textureSize: number, obj: THREE.Object3D) {
      const rt = new THREE.WebGLRenderTarget(textureSize, textureSize);

      const aspect = 1;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

      scene.add(obj);

      const box = new THREE.Box3().setFromObject(obj);

      const boxSize = box.getSize(new THREE.Vector3());
      const boxCenter = box.getCenter(new THREE.Vector3());

      const fudge = 1.1;
      const size = Math.max(...boxSize.toArray()) * fudge;
      frameArea(size, size, boxCenter, camera); // 调整相机位置

      renderer.autoClear = false;
      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.autoClear = true;

      scene.remove(obj);

      return {
        offset: boxCenter.multiplyScalar(fudge),
        scale: size,
        texture: rt.texture,
      };
    }

    // 生成雪碧图(纹理)
    // 利用WebGLRenderTarget只渲染一棵树，生成纹理
    const tree = makeTree(0, 0);
    const facadeSize = 64; // 尺寸(纹理大小)
    const treeSpriteInfo = makeSpriteTexture(facadeSize, tree);

    function makeSprite(spriteInfo: any, x: number, z: number) {
      const { texture, offset, scale } = spriteInfo;
      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(mat);
      scene.add(sprite);
      sprite.position.set(offset.x + x, offset.y, offset.z + z);
      sprite.scale.set(scale, scale, scale);
    }

    for (let z = -50; z <= 50; z += 10) {
      for (let x = -50; x <= 50; x += 10) {
        // makeTree(x, z);  // 绘制Mesh 网格
        makeSprite(treeSpriteInfo, x, z); // 绘制雪碧图 网格
      }
    }

    // 注: 必须在雪碧图纹理生成后再设置, 否则生成的纹理带有背景色
    {
      const size = 400;
      const geometry = new THREE.PlaneGeometry(size, size);
      const material = new THREE.MeshPhongMaterial({ color: "gray" });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = Math.PI * -0.5;
      scene.add(mesh);
    }
    scene.background = new THREE.Color("lightblue");

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
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
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
