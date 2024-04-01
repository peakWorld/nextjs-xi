"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize, frameArea } from "@/app/(ex-3d)/_utils/t_/common";
import { lutNameIndexMap, lutTextures, lutShader, lutNearestShader } from "./lut";

export default function Case4_8() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    const sceneBG = new THREE.Scene();

    const cameraBG = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    // 结合正交相机来设置背景图片
    let bgMesh: THREE.Mesh;
    let bgTexture: THREE.Texture;
    {
      const loader = new THREE.TextureLoader();
      bgTexture = loader.load("/t_/beach.jpg");
      bgTexture.colorSpace = THREE.SRGBColorSpace;
      const planeGeo = new THREE.PlaneGeometry(2, 2);
      const planeMat = new THREE.MeshBasicMaterial({
        map: bgTexture,
        depthTest: false,
      });
      bgMesh = new THREE.Mesh(planeGeo, planeMat);
      sceneBG.add(bgMesh);
    }

    // 透视相机展示的模型
    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load("/t_/3dbustchallange_submission/scene.gltf", (gltf) => {
        const root = gltf.scene;
        scene.add(root);

        root.traverse(({ material }) => {
          if (material) {
            material.depthWrite = true;
          }
        });

        const box = new THREE.Box3().setFromObject(root);
        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());
        frameArea(boxSize * 0.4, boxSize, boxCenter, camera);

        controls.maxDistance = boxSize * 10;
        controls.target.copy(boxCenter);
        controls.update();
      });
    }

    const lutSettings = {
      lut: lutNameIndexMap.identity,
    };
    const gui = new GUI({ width: 300 });
    gui.add(lutSettings, "lut", lutNameIndexMap);

    const effectLUT = new ShaderPass(lutShader);
    const effectLUTNearest = new ShaderPass(lutNearestShader);
    const renderModel = new RenderPass(scene, camera);
    renderModel.clear = false; // so we don't clear out the background
    const renderBG = new RenderPass(sceneBG, cameraBG);
    const outputPass = new OutputPass();

    const composer = new EffectComposer(renderer);
    composer.addPass(renderBG); // 通过enabled控制开启关闭
    composer.addPass(renderModel); // 通过enabled控制开启关闭
    composer.addPass(effectLUT); // 打开过滤
    composer.addPass(effectLUTNearest); // 关闭过滤
    composer.addPass(outputPass);

    let then = 0;
    function render(now: number) {
      now *= 0.001;
      const delta = now - then;
      then = now;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        const canvasAspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = canvasAspect;
        camera.updateProjectionMatrix();
        composer.setSize(canvas.width, canvas.height);

        // 适配背景图片大小
        const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
        const aspect = imageAspect / canvasAspect;
        bgMesh.scale.x = aspect > 1 ? aspect : 1;
        bgMesh.scale.y = aspect > 1 ? 1 : 1 / aspect;
      }

      // 控制LUT
      const lutInfo = lutTextures[lutSettings.lut];
      const effect = lutInfo.filter ? effectLUT : effectLUTNearest;
      effectLUT.enabled = lutInfo.filter;
      effectLUTNearest.enabled = !lutInfo.filter;
      const lutTexture = lutInfo.texture;
      effect.uniforms.lutMap.value = lutTexture;
      effect.uniforms.lutMapSize.value = lutInfo.size;

      composer.render(delta);
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
