"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case4_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const gui = new GUI();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const fov = 45;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();

    // 半球光
    {
      const skyColor = 0xb1e1ff; // 天空发出光线的颜色
      const groundColor = 0xb97a20; // 地面发出光线的颜色
      const intensity = 1;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(light);
    }

    // 方向光
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 0); // 光源位置
      light.target.position.set(-5, 0, 0); // 目标位置
      scene.add(light);
      scene.add(light.target); // 目标位置必须添加到scene
    }

    // 地板
    {
      const planeSize = 40;
      const loader = new THREE.TextureLoader();
      const texture = loader.load("/t_/checker.png");
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.rotation.x = Math.PI * -0.5;
      scene.add(plane);
    }

    {
      // 问题: 旋转模型时、风车布消失了 => 风车布单面材质
      const objLoader = new OBJLoader();
      const mtlLoader = new MTLLoader();
      mtlLoader.load("/t_/windmill/windmill-fixed.mtl", (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        // 方式一: 加载模型后，遍历所有材质，设置成双面。
        // 最理想的情况下是仅设置特定的材质为双面，其它无需设置成双面，毕竟渲染双面的效率低于单面。
        // for (const material of Object.values(mtl.materials)) {
        //   material.side = THREE.DoubleSide;
        // }

        // 方式二: 手动设置特定材质(找到几何体、及对应材质) => 推荐
        mtl.materials.Material.side = THREE.DoubleSide;

        objLoader.load("/t_/windmill/windmill.obj", (root) => {
          // 方式三: 在.MTL文件上无法解决，使用自行创建的材质
          // const materials: any = {
          //   Material: new THREE.MeshPhongMaterial({ color: "gray", side: THREE.DoubleSide }),
          //   windmill: new THREE.MeshPhongMaterial({ color: "blue", side: THREE.DoubleSide }),
          // };
          // root.traverse((node) => {
          //   const material = materials[node.material?.name];
          //   if (material) {
          //     node.material = material;
          //   }
          // });

          scene.add(root);
        });
      });
    }

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
