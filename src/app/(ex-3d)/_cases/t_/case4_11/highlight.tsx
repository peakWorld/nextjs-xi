"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  resizeRendererToDisplaySize,
  loadJSON,
  getCanvasRelativePosition,
  get255BasedColor,
} from "@/app/(ex-3d)/_utils/t_/common";
import { PickByGPU } from "@/app/(ex-3d)/_utils/t_/pickByGPU";

import "./index.scss";

export default function Case4_10() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const labelContainerElem = document.querySelector("#labels") as HTMLDivElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#246");

    const pickingScene = new THREE.Scene();
    pickingScene.background = new THREE.Color(0);

    const fov = 60;
    const aspect = 2; // canvas默认大小
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2.5;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 4;
    controls.update();

    // 调色板图形算法 => 创建调色板纹理
    const maxNumCountries = 512;
    const paletteTextureWidth = maxNumCountries;
    const paletteTextureHeight = 1;
    const palette = new Uint8Array(paletteTextureWidth * 4);
    const paletteTexture = new THREE.DataTexture(palette, paletteTextureWidth, paletteTextureHeight);
    paletteTexture.minFilter = THREE.NearestFilter;
    paletteTexture.magFilter = THREE.NearestFilter;
    paletteTexture.colorSpace = THREE.SRGBColorSpace;

    const selectedColor = get255BasedColor("red");
    const unselectedColor = get255BasedColor("#444");
    const oceanColor = get255BasedColor("rgb(100,200,255)");
    resetPalette();

    function setPaletteColor(index: number, color: number[]) {
      palette.set(color, index * 4);
    }

    function resetPalette() {
      // 让所有的颜色都是未选择状态的颜色
      for (let i = 1; i < maxNumCountries; ++i) {
        setPaletteColor(i, unselectedColor);
      }
      // 设置海洋颜色 (索引 #0)
      setPaletteColor(0, oceanColor);
      paletteTexture.needsUpdate = true;
    }

    {
      const loader = new THREE.TextureLoader();
      const geometry = new THREE.SphereGeometry(1, 64, 32);

      const indexTexture = loader.load("/t_/world/country-index-texture.png", render);
      indexTexture.minFilter = THREE.NearestFilter;
      indexTexture.magFilter = THREE.NearestFilter;
      const pickingMaterial = new THREE.MeshBasicMaterial({ map: indexTexture });
      pickingScene.add(new THREE.Mesh(geometry, pickingMaterial));

      // 修改默认着色器
      const fragmentShaderReplacements = [
        {
          from: "#include <common>",
          to: `
            #include <common>
            uniform sampler2D indexTexture;
            uniform sampler2D paletteTexture;
            uniform float paletteTextureWidth;
          `,
        },
        {
          from: "#include <color_fragment>",
          to: `
            #include <color_fragment>
            {
              // 一个国家的颜色在indexTexture纹理中是相同的, 则转换后颜色也一致
              vec4 indexColor = texture2D(indexTexture, vMapUv);

              // indexColor中的每个通道值范围为[0~1], 其实在indexTexture中只有R通道的值不为0
              // 将(0~1)转成 255中对应的整数值, 然后在paletteTextureWidth宽度中查找对应的颜色值
              float index = indexColor.r * 255.0;

              // 调色板纹理的高度为1px, 所以V值始终在纵轴中心处
              vec2 paletteUV = vec2((index + 0.5) / paletteTextureWidth, 0.5);

              vec4 paletteColor = texture2D(paletteTexture, paletteUV);
              // diffuseColor.rgb += paletteColor.rgb;   // white outlines
              diffuseColor.rgb = paletteColor.rgb - diffuseColor.rgb;  // black outlines
            }
          `,
        },
      ];
      const texture = loader.load("/t_/world/country-outlines-4k.png", render);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      scene.add(new THREE.Mesh(geometry, material));
      // 在shader编译前, 对shder进行额外处理
      material.onBeforeCompile = function (shader) {
        fragmentShaderReplacements.forEach((rep) => {
          shader.fragmentShader = shader.fragmentShader.replace(rep.from, rep.to);
        });
        shader.uniforms.paletteTexture = { value: paletteTexture };
        shader.uniforms.indexTexture = { value: indexTexture };
        shader.uniforms.paletteTextureWidth = { value: paletteTextureWidth };
      };
    }

    // 加载数据
    let countryInfos: any;
    let numCountriesSelected = 0;
    async function loadCountryData() {
      countryInfos = await loadJSON("/t_/world/country-info.json");

      // 经纬度辅助工具, 计算世界坐标
      const lonFudge = Math.PI * 1.5;
      const latFudge = Math.PI;
      const lonHelper = new THREE.Object3D();
      const latHelper = new THREE.Object3D();
      const positionHelper = new THREE.Object3D();
      positionHelper.position.z = 1;
      lonHelper.add(latHelper);
      latHelper.add(positionHelper);

      for (const countryInfo of countryInfos) {
        const { lat, lon, name, max, min } = countryInfo;
        // 偏移位置 + lon -180 ~ 180 / lat -90 ~ 90
        lonHelper.rotation.y = THREE.MathUtils.degToRad(lon) + lonFudge;
        latHelper.rotation.x = THREE.MathUtils.degToRad(lat) + latFudge;
        positionHelper.updateWorldMatrix(true, false);
        const position = new THREE.Vector3();
        positionHelper.getWorldPosition(position);
        countryInfo.position = position; // 每个country的世界坐标

        // 计算每个国家的面积
        const width = max[0] - min[0];
        const height = max[1] - min[1];
        const area = width * height;
        countryInfo.area = area;

        const elem = document.createElement("div");
        elem.textContent = name;
        labelContainerElem.appendChild(elem);
        countryInfo.elem = elem;
      }

      requestRenderIfNotRequested();
    }
    loadCountryData();

    const settings = { minArea: 20, maxVisibleDot: -0.2 };
    const tempV = new THREE.Vector3();
    const cameraToPoint = new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    const normalMatrix = new THREE.Matrix3();
    const large = settings.minArea * settings.minArea;

    // 实时更新标签
    function updateLabels() {
      if (!countryInfos) {
        return;
      }
      normalMatrix.getNormalMatrix(camera.matrixWorldInverse); // 获取表示相机相对方向的变换矩阵
      camera.getWorldPosition(cameraPosition); // 获取相机的世界坐标

      for (const countryInfo of countryInfos) {
        const { position, elem, area, selected } = countryInfo;
        const largeEnough = area >= large; // 问题解决 => 太多标签
        const show = selected || (numCountriesSelected === 0 && largeEnough); // 问题解决 => 指定国家

        if (!show) {
          elem.style.display = "none";
          continue;
        }

        // 问题解决 => 背面标签
        tempV.copy(position);
        tempV.applyMatrix3(normalMatrix);
        cameraToPoint.copy(position);
        cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();
        const dot = tempV.dot(cameraToPoint);
        if (dot > settings.maxVisibleDot) {
          elem.style.display = "none";
          continue;
        }
        elem.style.display = "";

        tempV.copy(position);
        tempV.project(camera);
        const x = (tempV.x * 0.5 + 0.5) * canvas.clientWidth;
        const y = (tempV.y * -0.5 + 0.5) * canvas.clientHeight;
        elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
        elem.style.zIndex = ((-tempV.z * 0.5 + 0.5) * 100000) | 0;
      }
    }

    // 选择国家 => 展示标签
    const pickHelper = new PickByGPU(renderer, pickingScene, camera);
    function pickCountry(event: PointerEvent) {
      if (!countryInfos) {
        return;
      }

      const position = getCanvasRelativePosition(event, canvas);
      const id = pickHelper.pickId(position);

      if (id > 0) {
        const countryInfo = countryInfos[id - 1];
        const selected = !countryInfo.selected;
        if (selected && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
          unselectAllCountries();
        }
        numCountriesSelected += selected ? 1 : -1;
        countryInfo.selected = selected;

        // 选中高亮
        setPaletteColor(id, selected ? selectedColor : unselectedColor);
        paletteTexture.needsUpdate = true;
      } else if (numCountriesSelected) {
        unselectAllCountries();
      }

      requestRenderIfNotRequested();
    }

    function unselectAllCountries() {
      numCountriesSelected = 0;
      countryInfos.forEach((countryInfo: any) => {
        countryInfo.selected = false;
      });

      resetPalette();
    }

    let renderRequested = false;
    function render() {
      renderRequested = false;
      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      controls.update();
      updateLabels();

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
    canvas.addEventListener("pointerup", pickCountry);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
      renderer.dispose();
      labelContainerElem!.innerHTML = "";
      document.querySelector(".lil-gui")?.remove();
      controls.removeEventListener("change", requestRenderIfNotRequested);
      window.removeEventListener("resize", requestRenderIfNotRequested);
      canvas.removeEventListener("pointerup", pickCountry);
    };
  }, []);

  return (
    <div id="container">
      <canvas ref={ref} className="w-full h-full block" />
      <div id="labels" className="order"></div>
    </div>
  );
}
