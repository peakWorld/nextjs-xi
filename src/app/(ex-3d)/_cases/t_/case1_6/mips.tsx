"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize, createMip } from "@/app/(ex-3d)/_utils/t_/common";

enum MIPS {
  LinearFilter = THREE.LinearFilter,
  NearestFilter = THREE.NearestFilter,
  NearestMipmapNearestFilter = THREE.NearestMipmapNearestFilter,
  NearestMipmapLinearFilter = THREE.NearestMipmapLinearFilter,
  LinearMipmapNearestFilter = THREE.LinearMipmapNearestFilter,
  LinearMipmapLinearFilter = THREE.LinearMipmapLinearFilter,
}

export default function Case1_6() {
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
    const objec3D = new THREE.Object3D();
    objec3D.rotation.x = Math.PI * 0.35; // 正值为逆时针方向旋转。
    scene.add(objec3D);

    const fov = 60;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 150;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 15;

    {
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);
    }

    const mipmap = [];

    // 方式一: TextureLoader
    // mip1.png图片尺寸为256*256, 则设置开始层级为9[根据createMip中计算方式]
    // const level = 9;
    // for (let i = 0; i < level; ++i) {
    //   mipmap.push(createMip(i, level, 1));
    // }
    // const loader = new THREE.TextureLoader();
    // function loadColorTexture(path: string) {
    //   const texture = loader.load(path);
    //   texture.colorSpace = THREE.SRGBColorSpace;
    //   return texture;
    // }
    // const texture = loadColorTexture("/t_/mips/mip1.png");

    // 方式二: CanvasTexture
    const level = 7;
    for (let i = 0; i < level; ++i) {
      mipmap.push(createMip(i, level, 1));
    }
    const texture = new THREE.CanvasTexture(mipmap[0]);

    texture.mipmaps = mipmap; // 自定义多层纹理Mips, 必须按梯队方式 => 64x64/32x32/16x16/8x8/4x4/2x2/1x1
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.y = 80;

    const mips = {
      mag: "LinearFilter",
      min: "LinearMipmapLinearFilter",
    };

    gui.add(mips, "mag", ["LinearFilter", "NearestFilter"]).onChange((ev) => {
      // @ts-ignore
      const magFilter = MIPS[ev];
      texture.magFilter = magFilter;
      texture.needsUpdate = true;
      console.log("mag =>", ev, magFilter);
    });
    gui
      .add(mips, "min", [
        "LinearFilter",
        "NearestFilter",
        "NearestMipmapNearestFilter",
        "NearestMipmapLinearFilter",
        "LinearMipmapNearestFilter",
        "LinearMipmapLinearFilter",
      ])
      .onChange((ev) => {
        // @ts-ignore
        const minFilter = MIPS[ev];
        texture.minFilter = minFilter;
        texture.needsUpdate = true;
        console.log("min =>", ev, minFilter);
      });

    const geometry = new THREE.PlaneGeometry(1, 80);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -15;
    objec3D.add(mesh);

    function render(time: number) {
      time *= 0.001;
      camera.position.y = Math.sin(time * 0.2);

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
