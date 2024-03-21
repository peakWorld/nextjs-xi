"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { resizeRendererToDisplaySize, dumpObject } from "@/app/(ex-3d)/_utils/t_/common";
import { curve } from "./line";

export default function Case4_2() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const gui = new GUI();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });
    renderer.shadowMap.enabled = true;

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
    scene.background = new THREE.Color("#DEFEFF");

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
      const intensity = 2.5;
      const light = new THREE.DirectionalLight(color, intensity);
      light.castShadow = true;
      light.position.set(-250, 800, -850);
      light.target.position.set(-550, 40, -450);

      light.shadow.bias = -0.004;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;

      scene.add(light);
      scene.add(light.target);
      const cam = light.shadow.camera;
      cam.near = 1;
      cam.far = 2000;
      cam.left = -1500;
      cam.right = 1500;
      cam.top = 1500;
      cam.bottom = -1500;
    }

    function frameArea(sizeToFitOnScreen: number, boxSize: number, boxCenter: THREE.Vector3, camera: THREE.Camera) {
      const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
      const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
      const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

      const direction = new THREE.Vector3()
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();

      camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
      camera.near = boxSize / 100;
      camera.far = boxSize * 100;
      camera.updateProjectionMatrix();
      camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
    }

    let cars: THREE.Object3D<THREE.Object3DEventMap>[] = [];
    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load("/t_/cartoon_lowpoly_small_city_free_pack/scene.gltf", (gltf) => {
        const root = gltf.scene;
        scene.add(root);
        // console.log("gltf", dumpObject(root));

        // 对小车进行修复处理
        const loadedCars = root.getObjectByName("Cars");
        const fixes = [
          { prefix: "Car_08", y: 0, rot: [Math.PI * 0.5, 0, Math.PI * 0.5] },
          { prefix: "CAR_03", y: 33, rot: [0, Math.PI, 0] },
          { prefix: "Car_04", y: 40, rot: [0, Math.PI, 0] },
        ];
        root.updateMatrixWorld(); // 更新物体及后代的全局变换
        console.log("root", root);
        // 修正Y轴旋转(在threejs中物品默认是Y轴朝上)
        for (const car of loadedCars!.children.slice()) {
          const fix = fixes.find((fix) => car.name.startsWith(fix.prefix));
          const obj = new THREE.Object3D(); // 新增父节点
          car.getWorldPosition(obj.position); // 新父节点拷贝原坐标位置
          car.position.set(0, fix!.y, 0); // 修正汽车到新父节点原点处, 且每辆车的高度不一致
          car.rotation.set(...(fix!.rot as [number, number, number])); // 修正汽车朝向
          obj.add(car); // 当前传入的对象中的父级将在这里被移除，因为一个对象仅能有一个父级。
          scene.add(obj);
          cars.push(obj);
        }
        // 开启阴影
        [...cars, root].forEach((node) => {
          node.traverse((obj) => {
            if (obj.castShadow !== undefined) {
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });
        });

        // 使得相机自动关注到模型
        const box = new THREE.Box3().setFromObject(root);
        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());
        frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

        controls.maxDistance = boxSize * 10;
        controls.target.copy(boxCenter);
        controls.update();
      });
    }

    let curveObject: THREE.Line;
    {
      const points = curve.getPoints(250);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      curveObject = new THREE.Line(geometry, material);
      // 路线最后渲染(调试路线) => 关闭深度测试, 设置最后渲染顺序
      // material.depthTest = false;
      // curveObject.renderOrder = 1;

      // 根据模型数据, 修正路线
      curveObject.scale.set(100, 100, 100);
      curveObject.position.y = -621;
      curveObject.visible = false;

      scene.add(curveObject);
    }

    // 创建两个向量用于路径计算
    const carPosition = new THREE.Vector3();
    const carTarget = new THREE.Vector3();

    function render(time: number) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // 问题一: 让小车绕y轴旋转, 发现卡车在错误的方向旋转
      //if (cars) {
      // for (const car of cars) {
      //   car.rotation.y = time;
      // }
      //}

      // 小车运动
      {
        // curve 是路线原始大小, curveObject 是经过放大、位移生成的路线
        // curve 获取移动点位置, curveObject 获取真实世界坐标矩阵
        // 两者间需要经过转化, 才能让小车沿着路线运动

        const pathTime = time * 0.01;
        const targetOffset = 0.01;
        cars.forEach((car, ndx) => {
          // 一个介于 0 和 1 之间的数字，用于均匀间隔汽车
          const u = pathTime + ndx / cars.length;
          // 获取第一个点
          curve.getPointAt(u % 1, carPosition);
          carPosition.applyMatrix4(curveObject.matrixWorld);
          // 曲线再远点获取第二个点
          curve.getPointAt((u + targetOffset) % 1, carTarget);
          carTarget.applyMatrix4(curveObject.matrixWorld);

          car.position.copy(carPosition); // 把汽车放置在第一个点 （暂时的）
          car.lookAt(carTarget); // 汽车的第二个点
          // 放置小车在两个点中间
          car.position.lerpVectors(carPosition, carTarget, 0.5);
        });
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
