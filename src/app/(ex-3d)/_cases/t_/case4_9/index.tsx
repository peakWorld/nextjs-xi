"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case4_9() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    const plane = new THREE.PlaneGeometry(2, 2);

    // 将像素输出颜色 和像素的窗口坐标、与每帧时间 结合起来, 形成动画效果
    const fragmentShader = `
    #include <common>

    // 自定义uniform, 非threejs内置uniform
    uniform vec3 iResolution;
    uniform float iTime;

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = fragCoord/iResolution.xy;
        vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx*40.0+vec3(0,2,4));
        fragColor = vec4(col,1.0);
    }

    void main() {
      // gl_FragColor 当前像素要设置的颜色
      // gl_FragCoord 当前像素的坐标(片段的窗口空间坐标, 起始处是窗口的左下角)
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `;
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
    };
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms,
    });
    scene.add(new THREE.Mesh(plane, material));

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // 每帧更新uniforms的值
      uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
      uniforms.iTime.value = time;

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
