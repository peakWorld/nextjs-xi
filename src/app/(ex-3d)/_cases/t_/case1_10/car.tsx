"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case1_10() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const gui = new GUI();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fff");

    const fov = 45;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 200;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0.4, 1, 1.7);
    camera.lookAt(1, 1, 0.7);

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 0, 0);
    controls.update();

    {
      const light = new THREE.PointLight(0xffffff, 1);
      light.position.copy(camera.position);
      light.position.y += 0.2;
      scene.add(light);
    }
    {
      const color = 0xffffff;
      const intensity = 2.5;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(3, 4, 5);
      scene.add(light);
    }

    const fog = new THREE.Fog(0xffffff, 1.5, 5); // 雾化

    gui
      .add({ show: false }, "show")
      .name("雾化")
      .onChange((flag) => {
        if (flag) {
          scene.fog = fog;
          controls.enabled = false;
          camera.position.set(0.4, 1, 1.7);
        } else {
          scene.fog = null;
          controls.enabled = true;
        }
      });

    {
      const loader = new GLTFLoader();
      const settings = {
        shininess: 0,
        roughness: 1,
        metalness: 0,
      };
      loader.load("/t_/scene.gltf", (gltf) => {
        const hackGeometry = new THREE.CircleGeometry(0.5, 32);
        const box = new THREE.Box3();
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        const materials = new Set();

        gltf.scene.traverse((node) => {
          const material = node.material;
          if (material) {
            if (node.name === "mesh_11" || node.name === "mesh_6") {
              node.updateWorldMatrix(true, false);
              box.setFromObject(node);
              box.getSize(size);
              box.getCenter(center);
              const hackMesh = new THREE.Mesh(hackGeometry, node.material);
              scene.add(hackMesh);
              hackMesh.position.copy(center);
              hackMesh.rotation.x = Math.PI * 0.5;
              hackMesh.position.y -= size.y / 2;
              hackMesh.scale.set(size.x, size.z, 1);
            }

            (Array.isArray(material) ? material : [material]).forEach((material) => {
              if (!materials.has(material)) {
                materials.add(material);
                for (const [key, value] of Object.entries(settings)) {
                  if (material[key] !== undefined) {
                    material[key] = value;
                  }
                }

                // 将房子内的材质设置为不受雾的影响。‘’
                // if (material.name.startsWith("fogless")) {
                //   material.fog = false;
                // }
              }
            });
          }
        });

        scene.add(gltf.scene);
      });
    }

    const target = [1, 1, 0.7];
    function render(time: number) {
      time *= 0.001;

      camera.lookAt(target[0] + Math.sin(time * 0.25) * 0.5, target[1], target[2]);

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
