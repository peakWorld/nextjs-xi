"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import "./index.scss";

interface Model {
  url: string;
  gltf?: GLTF;
  animations?: Record<string, THREE.AnimationClip>;
}

interface MixerInfo {
  mixer: THREE.AnimationMixer;
  actions: Array<THREE.AnimationAction>;
  actionNdx: number;
}

export default function Case5_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const fov = 45;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 20, 40);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    function addLight(...pos: Tuple<number, 3>) {
      const color = 0xffffff;
      const intensity = 2.5;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...pos);
      scene.add(light);
      scene.add(light.target);
    }

    addLight(5, 5, 2);
    addLight(-5, 5, 5);

    // 加载模型, 展示进度条
    const manager = new THREE.LoadingManager();
    const progressbarElem = document.querySelector("#progressbar") as HTMLDivElement;
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      progressbarElem.style.width = `${((itemsLoaded / itemsTotal) * 100) | 0}%`;
    };
    manager.onLoad = init;
    const models: Record<string, Model> = {
      pig: { url: "/t_/animals/Pig.gltf" },
      cow: { url: "/t_/animals/Cow.gltf" },
      llama: { url: "/t_/animals/Llama.gltf" },
      pug: { url: "/t_/animals/Pug.gltf" },
      sheep: { url: "/t_/animals/Sheep.gltf" },
      zebra: { url: "/t_/animals/Zebra.gltf" },
      horse: { url: "/t_/animals/Horse.gltf" },
      knight: { url: "/t_/knight/KnightCharacter.gltf" },
    };
    {
      const gltfLoader = new GLTFLoader(manager);
      for (const model of Object.values(models)) {
        gltfLoader.load(model.url, (gltf) => {
          model.gltf = gltf;
        });
      }
    }

    function prepModelsAndAnimations() {
      Object.values(models).forEach((model) => {
        const animsByName: Record<string, THREE.AnimationClip> = {};
        model.gltf!.animations.forEach((clip) => {
          animsByName[clip.name] = clip; // 动画剪辑 集合
        });
        model.animations = animsByName;
      });
    }

    const mixerInfos: Array<MixerInfo> = [];
    function init() {
      const loadingElem = document.querySelector("#loading") as HTMLDivElement;
      loadingElem.style.display = "none";
      prepModelsAndAnimations();

      Object.values(models).forEach((model, ndx) => {
        const clonedScene = SkeletonUtils.clone(model.gltf!.scene); // 骨架工具
        const root = new THREE.Object3D();
        root.add(clonedScene);
        scene.add(root);
        root.position.x = (ndx - 3) * 3;

        const mixer = new THREE.AnimationMixer(clonedScene);
        const actions = Object.values(model.animations as Record<string, THREE.AnimationClip>).map((clip) => {
          return mixer.clipAction(clip);
        });
        const mixerInfo = {
          mixer,
          actions,
          actionNdx: -1,
        };
        mixerInfos.push(mixerInfo);
        playNextAction(mixerInfo);
      });
    }

    function playNextAction(mixerInfo: MixerInfo) {
      const { actions, actionNdx } = mixerInfo;
      const nextActionNdx = (actionNdx + 1) % actions.length; // 模型动画集合中的下一个动画<序号+1>
      mixerInfo.actionNdx = nextActionNdx;
      actions.forEach((action, ndx) => {
        const enabled = ndx === nextActionNdx;
        action.enabled = enabled; // 开启/禁止此动画
        if (enabled) {
          action.play();
        }
      });
    }

    let then = 0;
    function render(now: number) {
      now *= 0.001;
      const deltaTime = now - then;
      then = now;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // 动画更新
      for (const { mixer } of mixerInfos) {
        mixer.update(deltaTime);
      }

      renderer.render(scene, camera);
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    function player(e: KeyboardEvent) {
      const mixerInfo = mixerInfos[e.keyCode - 49];
      if (!mixerInfo) {
        return;
      }
      playNextAction(mixerInfo); // 模仿制定模型动画
    }

    window.addEventListener("keydown", player);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
      window.removeEventListener("keydown", player);
    };
  }, []);

  return (
    <div className="case5_1_dh w-full h-full">
      <canvas ref={ref} className="w-full h-full" />
      <div id="loading">
        <div className="progress">
          <div id="progressbar"></div>
        </div>
      </div>
    </div>
  );
}
