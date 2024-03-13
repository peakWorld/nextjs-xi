"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";

async function loadFile(url: string) {
  const req = await fetch(url);
  return req.text();
}
type UN = number | undefined;

export default function Case3_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();

    const fov = 60;
    const aspect = 2;
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2.5;

    const controls = new OrbitControls(camera, canvas); // 相机控制器
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 4;
    controls.update();

    const loader = new THREE.TextureLoader();
    const texture = loader.load("/t_/world.jpg", render);
    const geometry = new THREE.SphereGeometry(1, 64, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    scene.add(new THREE.Mesh(geometry, material));

    function parseData(text: string) {
      const data: UN[][] = [];
      const settings: Record<string, any> = { data };
      let max: UN;
      let min: UN;
      text.split("\n").forEach((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length === 2) {
          settings[parts[0]] = parseFloat(parts[1]);
        } else if (parts.length > 2) {
          const values = parts.map((v) => {
            const value = parseFloat(v);
            if (value === settings.NODATA_value) {
              return undefined;
            }
            max = Math.max(max === undefined ? value : max, value);
            min = Math.min(min === undefined ? value : min, value);
            return value;
          });
          data.push(values);
        }
      });
      return Object.assign(settings, { min, max });
    }

    function addBoxes(file: Record<string, any>) {
      const { min, max, data } = file;
      const range = max - min;

      // 辅助计算点的位置
      const lonHelper = new THREE.Object3D(); // 经度辅助, 绕Y轴旋转
      const latHelper = new THREE.Object3D(); // 纬度辅助, 绕X轴旋转
      const positionHelper = new THREE.Object3D(); // 位置辅助
      positionHelper.position.z = 1;
      lonHelper.add(latHelper);
      latHelper.add(positionHelper);

      const originHelper = new THREE.Object3D();
      originHelper.position.z = 0.5;
      positionHelper.add(originHelper);

      // 经纬度偏移量
      const lonFudge = Math.PI * 0.5;
      const latFudge = Math.PI * -0.135;
      const geometries: THREE.BufferGeometry[] = [];
      const color = new THREE.Color();

      // 使用经度和纬度遍历数据 latNdx 纬度索引；lonNdx 经度索引
      data.forEach((row: UN[], latNdx: number) => {
        row.forEach((value, lonNdx) => {
          if (value === undefined) {
            return;
          }

          const amount = (value - min) / range;

          const boxWidth = 1;
          const boxHeight = 1;
          const boxDepth = 1;
          const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

          // xllcorner -60度 ， yllcorner -180度
          // 将度数转成弧度, 添加偏移量 lonFudge、latFudge 得到相对正确经纬度
          lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
          latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

          // 将经纬度转换成世界坐标
          positionHelper.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
          originHelper.updateWorldMatrix(true, false);
          geometry.applyMatrix4(originHelper.matrixWorld); // 对网格进行处理, 获得新的网格信息

          // 计算每个网格的颜色
          const hue = THREE.MathUtils.lerp(0.7, 0.3, amount);
          const saturation = 1;
          const lightness = THREE.MathUtils.lerp(0.4, 1.0, amount);
          color.setHSL(hue, saturation, lightness);
          const rgb = color.toArray().map((v) => v * 255);
          const numVerts = geometry.getAttribute("position").count; // 创建一个数组来存储每个顶点的颜色
          const itemSize = 3; // r, g, b
          const colors = new Uint8Array(itemSize * numVerts);
          // 将颜色复制到每个顶点的颜色数组中
          colors.forEach((v, ndx) => {
            colors[ndx] = rgb[ndx % 3];
          });
          const normalized = true;
          const colorAttrib = new THREE.BufferAttribute(colors, itemSize, normalized);
          geometry.setAttribute("color", colorAttrib);

          geometries.push(geometry);
        });
      });

      const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
      const material = new THREE.MeshBasicMaterial({ vertexColors: true });
      const mesh = new THREE.Mesh(mergedGeometry, material);
      scene.add(mesh);
    }

    loadFile("/t_/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc")
      .then(parseData)
      .then(addBoxes)
      .then(render);

    let renderRequested = false;
    function render() {
      renderRequested = false;
      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
    }
    render();

    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
      }
    }

    controls.addEventListener("change", requestRenderIfNotRequested);
    window.addEventListener("resize", requestRenderIfNotRequested);

    return () => {
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
      controls.removeEventListener("change", requestRenderIfNotRequested);
      window.removeEventListener("resize", requestRenderIfNotRequested);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
