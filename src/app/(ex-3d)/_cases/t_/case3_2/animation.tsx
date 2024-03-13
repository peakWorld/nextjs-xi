//@ts-nocheck
"use client";

import { use, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import TWEEN from "three/addons/libs/tween.module.js";
import { resizeRendererToDisplaySize } from "@/app/(ex-3d)/_utils/t_/common";
import { TweenManger } from "@/app/(ex-3d)/_utils/t_/tweenManger";
import { useAsyncState } from "@/hooks/common";
import "./index.scss";
import clsx from "clsx";

type UN = number | undefined;

// 获取男女两份数据(不论数据对错)
const fileInfos = [
  {
    name: "men",
    hueRange: [0.7, 0.3], // 颜色范围
    url: "/t_/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc",
  },
  {
    name: "women",
    hueRange: [0.9, 1.1],
    url: "/t_/gpw_v4_basic_demographic_characteristics_rev10_a000_014ft_2010_cntm_1_deg.asc",
  },
];
const tweenManager = new TweenManger();

export default function Case3_2() {
  const ref = useRef<HTMLCanvasElement>(null);
  const renderRef = useRef(null);
  const [selected, setSelected] = useState(0);

  const [mesh] = useAsyncState(async () => {
    async function loadFile(url: string) {
      const req = await fetch(url);
      return req.text();
    }

    async function loadData(info) {
      const text = await loadFile(info.url);
      info.file = parseData(text);
    }

    function amountGreaterThan(a, b) {
      return Math.max(a - b, 0);
    }

    // 数据的每个经纬度进行比较处理
    function mapValues(data, fn) {
      return data.map((row, rowNdx) => {
        return row.map((value, colNdx) => {
          return fn(value, rowNdx, colNdx);
        });
      });
    }

    function makeDiffFile(baseFile, otherFile, compareFn) {
      let min;
      let max;
      const baseData = baseFile.data;
      const otherData = otherFile.data;
      const data = mapValues(baseData, (base, rowNdx, colNdx) => {
        const other = otherData[rowNdx][colNdx];
        if (base === undefined || other === undefined) {
          return undefined;
        }

        const value = compareFn(base, other);
        min = Math.min(min === undefined ? value : min, value);
        max = Math.max(max === undefined ? value : max, value);
        return value;
      });
      return { ...baseFile, min, max, data };
    }

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

    // 检查所有的数据集，如果任何一个数据集中有数据, 就总是生成一些东西;如果任何一个数据集中缺少数据, 就什么也不生成.
    // 以后者为准.
    function dataMissingInAnySet(fileInfos, latNdx, lonNdx) {
      for (const fileInfo of fileInfos) {
        if (fileInfo.file.data[latNdx][lonNdx] === undefined) {
          return true;
        }
      }
      return false;
    }

    function makeBoxes(file: Record<string, any>, hueRange: [number, number], fileInfos: any) {
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
          if (value === undefined || dataMissingInAnySet(fileInfos, latNdx, lonNdx)) {
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
          geometry.applyMatrix4(originHelper.matrixWorld); // 对网格进行处理, 获得新的网格点坐标

          // 计算每个网格的颜色
          const hue = THREE.MathUtils.lerp(...hueRange, amount);
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

      return BufferGeometryUtils.mergeGeometries(geometries, false);
    }

    // 获取数据文件信息
    await Promise.all(fileInfos.map(loadData));
    // 计算两份差异数据
    const menFile = fileInfos[0].file;
    const womenFile = fileInfos[1].file;

    fileInfos.push({
      name: ">50%men",
      hueRange: [0.6, 1.1],
      file: makeDiffFile(menFile, womenFile, (men, women) => {
        return amountGreaterThan(men, women);
      }),
    });
    fileInfos.push({
      name: ">50% women",
      hueRange: [0.0, 0.4],
      file: makeDiffFile(womenFile, menFile, (women, men) => {
        return amountGreaterThan(women, men);
      }),
    });

    /**** 使用Morphtargets */

    // 对每一个数据集生成几何体
    const geometries = fileInfos.map((info) => {
      return makeBoxes(info.file, info.hueRange, fileInfos);
    });

    // 以第一个几何体作为基准, 将其他的作为变形目标
    const baseGeometry = geometries[0];
    baseGeometry.morphAttributes.position = geometries.map((geometry, ndx) => {
      const attribute = geometry.getAttribute("position");
      const name = `target${ndx}`;
      attribute.name = name;
      return attribute;
    });
    baseGeometry.morphAttributes.color = geometries.map((geometry, ndx) => {
      const attribute = geometry.getAttribute("color");
      const name = `target${ndx}`;
      attribute.name = name;
      return attribute;
    });
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
    });
    const mesh = new THREE.Mesh(baseGeometry, material);
    mesh.userData = { infos: fileInfos.map(({ name }) => name) };
    return mesh;
  });

  useEffect(() => {
    if (!mesh) return;
    let timer = -1;
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

    scene.add(mesh);

    let renderRequested = false;
    function render() {
      renderRequested = false;
      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // 利用tween修改mesh.morphTargetInfluences在每一帧中的值, 然后执行重绘
      // 结合tween与requestAnimationFrame 一起使用, 实现动画效果
      if (tweenManager.update()) {
        requestRenderIfNotRequested();
      }

      renderer.render(scene, camera);
    }
    render();

    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        timer = requestAnimationFrame(render);
      }
    }

    renderRef.current = requestRenderIfNotRequested;

    controls.addEventListener("change", requestRenderIfNotRequested);
    window.addEventListener("resize", requestRenderIfNotRequested);

    return () => {
      renderer.dispose();
      if (timer > -1) cancelAnimationFrame(timer);
      document.querySelector(".lil-gui")?.remove();
      controls.removeEventListener("change", requestRenderIfNotRequested);
      window.removeEventListener("resize", requestRenderIfNotRequested);
    };
  }, [mesh]);

  useEffect(() => {
    if (!mesh) return;

    // 变形目标 需要到的形状其influence为1,其他形状的influence为0
    const targets = {};
    mesh.morphTargetInfluences.forEach((_, i) => {
      targets[i] = i === selected ? 1 : 0;
    });

    // 无动画, 直接形变
    // mesh.morphTargetInfluences = Object.keys(targets)
    //   .sort()
    //   .map((v) => targets[v]);

    // 添加动画
    const durationInMs = 1000;
    tweenManager.createTween(mesh.morphTargetInfluences).to(targets, durationInMs).start();

    renderRef.current();
  }, [mesh, selected]);

  return (
    <div className="wrap3_2 w-full h-full">
      <canvas ref={ref} className="w-full h-full" />
      <div id="ui">
        {mesh?.userData.infos?.map((name, i) => {
          return (
            <div
              key={name}
              onClick={() => setSelected(i)}
              className={clsx({ selected: i === selected })} // 按需渲染
            >
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
