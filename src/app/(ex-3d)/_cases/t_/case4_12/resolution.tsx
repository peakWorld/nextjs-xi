"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case4_12() {
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

    const fov = 75;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 2, 5);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 2, 0);
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

    // canvas 2D 中绘制文字标签
    const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;

    function makeLabelCanvas(baseWidth: number, size: number, name: string) {
      const borderSize = 2;
      const font = `${size}px bold sans-serif`;
      ctx.font = font;
      // 测量一下name有多长
      const textWidth = ctx.measureText(name).width;

      const doubleBorderSize = borderSize * 2;
      const width = baseWidth + doubleBorderSize;
      const height = size + doubleBorderSize;
      ctx.canvas.width = width;
      ctx.canvas.height = height;

      ctx.font = font;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, width, height);

      // 缩放以适应，但是不要拉伸
      const scaleFactor = Math.min(1, baseWidth / textWidth);
      ctx.translate(width / 2, height / 2);
      ctx.scale(scaleFactor, 1);
      ctx.fillStyle = "white";
      ctx.fillText(name, borderSize, borderSize);

      return ctx.canvas;
    }

    const bodyRadiusTop = 0.4;
    const bodyRadiusBottom = 0.2;
    const bodyHeight = 2;
    const bodyRadialSegments = 6;
    const bodyGeometry = new THREE.CylinderGeometry(bodyRadiusTop, bodyRadiusBottom, bodyHeight, bodyRadialSegments);

    const headRadius = bodyRadiusTop * 0.8;
    const headLonSegments = 12;
    const headLatSegments = 5;
    const headGeometry = new THREE.SphereGeometry(headRadius, headLonSegments, headLatSegments);

    const labelGeometry = new THREE.PlaneGeometry(1, 1);

    const forceTextureInitialization = (function () {
      const material = new THREE.MeshBasicMaterial();
      const geometry = new THREE.PlaneGeometry();
      const scene = new THREE.Scene();
      scene.add(new THREE.Mesh(geometry, material));
      const camera = new THREE.Camera();

      return function forceTextureInitialization(texture: THREE.Texture) {
        material.map = texture;
        // 渲染一帧, 确保纹理被正确初始化
        // 对于在渲染循环之外使用纹理时非常有用
        renderer.render(scene, camera);
      };
    })();

    function makePerson(x: number, labelWidth: number, size: number, name: string, color: string) {
      const canvas = makeLabelCanvas(labelWidth, size, name);
      const texture = new THREE.CanvasTexture(canvas);
      // 因为Canvas长宽都不太可能是2的倍数，所以将filtering设置合理一些
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      // 一个Canvas，通过THREE.js来生成多个纹理。
      // 解决初始化时canvas内容覆盖问题
      forceTextureInitialization(texture);

      const labelMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color,
        flatShading: true,
      });

      const root = new THREE.Object3D();
      root.position.x = x;

      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      root.add(body);
      body.position.y = bodyHeight / 2;

      const head = new THREE.Mesh(headGeometry, bodyMaterial);
      root.add(head);
      head.position.y = bodyHeight + headRadius * 1.1;

      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      root.add(label);
      label.position.y = (bodyHeight * 4) / 5;
      label.position.z = bodyRadiusTop * 1.01;

      // 使对象label适配纹理(未适配, 文字会缩放)
      // 但是canva的长宽太大、设置一个适当的缩放比。
      const labelBaseScale = 0.01;
      label.scale.x = canvas.width * labelBaseScale;
      label.scale.y = canvas.height * labelBaseScale;

      scene.add(root);
      return root;
    }

    // 初始化时, 如果使用同一个canvas创建纹理, 后面的覆盖前面的
    // 每帧渲染时, 纹理改变需要设置needsUpdate
    makePerson(-3, 150, 32, "Purple People Eater", "purple");
    makePerson(-0, 150, 32, "Green Machine", "green");
    makePerson(+3, 150, 32, "Red Menace", "red");

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
