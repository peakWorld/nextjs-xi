"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { AllMaterialPropertyGUIHelper, DimensionGUIHelper } from "@/app/(ex-3d)/_utils/t_/helpers";

export default function Case4_4() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const fov = 75;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 25;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.enableDamping = true;

    function addLight(...pos: [number, number, number]) {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...pos);
      scene.add(light);
    }
    addLight(-1, 2, 4);
    addLight(1, -1, -2);

    const planeWidth = 1;
    const planeHeight = 1;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    const loader = new THREE.TextureLoader();

    function makeInstance(geometry: THREE.PlaneGeometry, color: string, rotY: number, url: string) {
      const texture = loader.load(url, render);
      const material = new THREE.MeshPhongMaterial({
        color,
        map: texture,
        transparent: true,
        alphaTest: 0.5, // alpha值。运行alphaTest时要使用的alpha值。
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      mesh.rotation.y = rotY;
    }

    makeInstance(geometry, "pink", 0, "/t_/tree-01.png");
    makeInstance(geometry, "lightblue", Math.PI * 0.5, "/t_/tree-02.png");

    // 调节mesh的透明度
    const gui = new GUI();
    gui
      .add(new AllMaterialPropertyGUIHelper("alphaTest", scene), "value", 0, 1)
      .name("alphaTest")
      .onChange(requestRenderIfNotRequested);
    gui
      .add(new AllMaterialPropertyGUIHelper("transparent", scene), "value")
      .name("transparent")
      .onChange(requestRenderIfNotRequested);

    let renderRequested = false;
    function render() {
      renderRequested = false;
      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
    }
    render(); // 渲染一次

    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
      }
    }

    // 增加阻尼感, 体验更加真实
    controls.addEventListener("change", requestRenderIfNotRequested); // 改变摄像机设置的时候渲染场景
    window.addEventListener("resize", requestRenderIfNotRequested); // 改变窗口大小的时候渲染场景

    return () => {
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
      controls.removeEventListener("change", requestRenderIfNotRequested);
      window.removeEventListener("resize", requestRenderIfNotRequested);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
