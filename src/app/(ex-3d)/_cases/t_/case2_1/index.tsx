"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { ColorGUIHelper } from "@/app/(ex-3d)/_utils/t_/helpers/index";

export default function Case2_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const gui = new GUI();

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

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.enableDamping = true;

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

      const folder = gui.addFolder(`Cube${x}`);
      folder
        .addColor(new ColorGUIHelper(material, "color"), "value")
        .name("color")
        .onChange(requestRenderIfNotRequested); // 颜色改变, 重新渲染
      folder.add(cube.scale, "x", 0.1, 1.5).name("scale x").onChange(requestRenderIfNotRequested); // 大小改变, 重新渲染
      folder.open();
      return cube;
    }

    makeCube(geometry, 0x8844aa, -2);
    makeCube(geometry, 0x44aa88, 0);
    makeCube(geometry, 0xaa8844, 2);

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

    // controls.addEventListener("change", render);
    // window.addEventListener("resize", render);

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
