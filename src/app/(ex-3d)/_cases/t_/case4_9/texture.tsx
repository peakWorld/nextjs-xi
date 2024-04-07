"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case4_9() {
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

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    // 将像素输出颜色 和像素的窗口坐标、与每帧时间 结合起来, 形成动画效果
    const fragmentShader = `
    #include <common>

    uniform vec3 iResolution;
    uniform float iTime;
    uniform sampler2D iChannel0;

    #define TIMESCALE 0.25
    #define TILES 8
    #define COLOR 0.7, 1.6, 2.8

    void mainImage(out vec4 fragColor, in vec2 fragCoord)
    {
      vec2 uv = fragCoord/iResolution.xy;
      uv.x *= iResolution.x / iResolution.y;

      vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
      float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
      p = min(max(p * 3.0 - 1.8, 0.1), 2.0);

      vec2 r = mod(uv * float(TILES), 1.0);
      r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
      p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);

      fragColor = vec4(COLOR, 1.0) * p;
    }
    varying vec2 vUv; // threejs 提供的纹理坐标, 传给片段着色器

    void main() {
      // 使用纹理坐标(vUv) 替换 像素坐标(gl_FragCoord)
      mainImage(gl_FragColor, vUv * iResolution.xy);
    }
    `;

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;

    const loader = new THREE.TextureLoader();
    const texture = loader.load("/t_/bayer.png");
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(1, 1, 1) },
      iChannel0: { value: texture },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    plane.visible = false;
    scene.add(plane);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    function makeInstance(geometry: THREE.BoxGeometry, x: number) {
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      cube.position.x = x;
      return cube;
    }
    const cubes = [makeInstance(geometry, 0), makeInstance(geometry, -2), makeInstance(geometry, 2)];

    const show = {
      plane: false,
    };

    gui
      .add(show, "plane")
      .name("Plane")
      .onChange((value) => {
        plane.visible = value;
        cubes.forEach((cube) => (cube.visible = !value));
      });

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // 每帧更新uniforms的值
      uniforms.iTime.value = time;

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);
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
