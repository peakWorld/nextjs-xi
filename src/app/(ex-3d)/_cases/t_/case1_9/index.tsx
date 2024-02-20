"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

interface ShadowBase {
  base: THREE.Object3D;
  sphereMesh: THREE.Mesh;
  shadowMesh: THREE.Mesh;
  y: number;
}

export default function Case1_9() {
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
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    {
      // 半球光
      const skyColor = 0xb1e1ff;
      const groundColor = 0xb97a20;
      const intensity = 0.75;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(light);
    }
    {
      // 方向光
      const color = 0xffffff;
      const intensity = 2.5;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 5);
      light.target.position.set(-5, 0, 0);
      scene.add(light);
      scene.add(light.target);
    }

    const loader = new THREE.TextureLoader();
    {
      const planeSize = 40;
      const texture = loader.load("/t_/checker.png");
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      planeMat.color.setRGB(1.5, 1.5, 1.5); // 纹理的颜色倍增1.5
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.rotation.x = Math.PI * -0.5;
      scene.add(plane);
    }

    const sphereShadowBases: ShadowBase[] = [];
    {
      const shadowTexture = loader.load("/t_/roundshadow.png");

      const sphereRadius = 1;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

      const shadwoPlaneSize = 1;
      const shadowGeo = new THREE.PlaneGeometry(shadwoPlaneSize, shadwoPlaneSize);

      const numSpheres = 15;
      for (let i = 0; i < numSpheres; i++) {
        const base = new THREE.Object3D(); // 球体和阴影 整体一起
        scene.add(base);

        // 阴影材质不跟随光照改变
        const shadowMat = new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true, // 贴图透明, 能观察到地板 => 防止Z轴阴影和地面重叠
          depthWrite: false, // 关闭深度测试, 直接绘制阴影 => 使阴影之间不会彼此混淆
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat); // 假阴影
        shadowMesh.position.y = 0.001; // 防止Z轴冲突
        shadowMesh.rotation.x = Math.PI * -0.5;
        const shadowSize = sphereRadius * 4;
        shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
        base.add(shadowMesh);

        const u = i / numSpheres;
        // 物体材质跟随光照改变
        const sphereMat = new THREE.MeshPhongMaterial();
        sphereMat.color.setHSL(u, 1, 0.75);
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat); // 球体
        sphereMesh.position.set(0, sphereRadius + 2, 0);
        base.add(sphereMesh);

        sphereShadowBases.push({
          base,
          sphereMesh,
          shadowMesh,
          y: sphereMesh.position.y,
        });
      }
    }

    function render(time: number) {
      time *= 0.001; // 转换成秒

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      sphereShadowBases.forEach((sphereShadowBase, ndx) => {
        const { base, sphereMesh, shadowMesh, y } = sphereShadowBase;
        const u = ndx / sphereShadowBases.length;

        // 设置每个实例整体 在 XZ 平面上移动
        const speed = time * 0.2;
        const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
        const radius = Math.sin(speed - ndx) * 10;
        base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

        // 设置 阴影材质的不透明度，与球体的高度相关。高度越高，阴影越模糊。
        const yOff = Math.abs(Math.sin(time * 2 + ndx)); // Y值限定在 [0, 1]
        sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff); // 球体单独在Y轴上下运动
        // 球体在Y轴上下运动, 阴影跟随改变
        (shadowMesh.material as THREE.Material).opacity = THREE.MathUtils.lerp(1, 0.25, yOff);
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

// 物品和阴影 整体一起在x\z轴移动, 物品单独在y轴移动、阴影跟随物品变化
