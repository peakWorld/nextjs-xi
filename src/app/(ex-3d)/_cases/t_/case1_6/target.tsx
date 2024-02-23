"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case1_6() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    // 真正场景
    const fov = 60;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 15;

    {
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);
    }

    const gui = new GUI();
    const obj = { scale: 0.6 };
    gui
      .add(obj, "scale")
      .min(0)
      .max(1)
      .step(0.1)
      .name("scale")
      .onChange((evt) => {
        // 缩放mesh大小 => 则用小级别的mip来决定mesh展示的颜色
        mesh.scale.set(evt, evt, evt);
      });

    const loader = new THREE.TextureLoader();

    function loadColorTexture(path: string) {
      const texture = loader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    const geometry = new THREE.BoxGeometry(8, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      map: loadColorTexture("/t_/mip-low-res-enlarged.png"),
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 后台绘制 => 在正交相机中渲染平面纹理
    const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
    });
    const planeScene = new THREE.Scene();
    const plane = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: renderTarget.texture, // 以纹理的形式渲染图像
    });
    const planeMesh = new THREE.Mesh(plane, planeMaterial);
    planeScene.add(planeMesh);
    const planeCamera = new THREE.OrthographicCamera(0, 1, 0, 1, -1, 1);
    planeCamera.position.z = 1;

    const pixelSize = 16 * window.devicePixelRatio;

    function render(time: number) {
      time *= 0.001;
      mesh.rotation.set(time, time, time);

      resizeRendererToDisplaySize(renderer, canvas);

      // 渲染场景
      // 将真正场景绘制到renderTarget, 更新对应纹理
      const rtWidth = canvas.clientWidth / pixelSize;
      const rtHeight = canvas.clientHeight / pixelSize;
      renderTarget.setSize(rtWidth, rtHeight);
      camera.aspect = rtWidth / rtHeight;
      camera.updateProjectionMatrix();
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);

      // 后期渲染
      // 利用renderTarget.texture将纹理渲染到前台, 正交相机的正面大小为整个屏幕
      const viewWidth = canvas.clientWidth / pixelSize;
      const viewHeight = canvas.clientHeight / pixelSize;
      planeCamera.left = -viewWidth / 2;
      planeCamera.right = viewWidth / 2;
      planeCamera.top = viewHeight / 2;
      planeCamera.bottom = -viewHeight / 2;
      planeCamera.updateProjectionMatrix();

      // planeMesh的纹理保存了要渲染的图像, 将planeMesh铺满整个屏幕
      planeMesh.scale.set(renderTarget.width, renderTarget.height, 1);
      renderer.render(planeScene, planeCamera);

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
