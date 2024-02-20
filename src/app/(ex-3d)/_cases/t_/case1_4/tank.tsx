"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeRendererToDisplaySize, makePCamera } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case1_4_Tank() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });
    renderer.setClearColor(0xaaaaaa);
    renderer.shadowMap.enabled = true; // shadow: 使用阴影贴图

    const scene = new THREE.Scene();

    const camera = makePCamera();
    camera.position.set(8, 4, 10).multiplyScalar(3);
    camera.lookAt(0, 0, 0);

    {
      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(0, 20, 0); // 方向从position->target; target默认为(0,0,0)
      scene.add(light);

      light.castShadow = true; // shadow: 平行光将投射阴影
      light.shadow.mapSize.set(2048, 2048); // 阴影贴图的宽度和高度

      const d = 50;
      light.shadow.camera.left = -d;
      light.shadow.camera.right = d;
      light.shadow.camera.top = d;
      light.shadow.camera.bottom = -d;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 50;
      light.shadow.bias = 0.001;
    }

    {
      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(1, 2, 4);
      scene.add(light);
    }

    // 平台
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcc8866 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = Math.PI * -0.5;
    groundMesh.receiveShadow = true; // shadow: 材质接收阴影
    scene.add(groundMesh);

    // 坦克
    const carWidth = 4;
    const carHeight = 1;
    const carLength = 8;

    const tank = new THREE.Object3D();
    scene.add(tank);

    const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 1.4;
    bodyMesh.castShadow = true;
    tank.add(bodyMesh);

    const tankCameraFov = 75;
    const tankCamera = makePCamera(tankCameraFov);
    tankCamera.position.y = 3;
    tankCamera.position.z = -6;
    tankCamera.rotation.y = Math.PI;
    bodyMesh.add(tankCamera);

    const wheelRadius = 1;
    const wheelThickness = 0.5;
    const wheelSegments = 6;
    const wheelGeometry = new THREE.CylinderGeometry(
      wheelRadius, // top radius
      wheelRadius, // bottom radius
      wheelThickness, // height of cylinder
      wheelSegments
    );
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const wheelPositions = [
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
    ];
    const wheelMeshes = wheelPositions.map((position) => {
      const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
      mesh.position.set(...(position as [number, number, number]));
      mesh.rotation.z = Math.PI * 0.5;
      mesh.castShadow = true;
      bodyMesh.add(mesh); // mesh被添加到bodyMesh; 则mesh相对于bodyMesh中心(原点)计算位移
      return mesh;
    });

    const domeRadius = 2;
    const domeWidthSubdivisions = 12;
    const domeHeightSubdivisions = 12;
    const domePhiStart = 0;
    const domePhiEnd = Math.PI * 2;
    const domeThetaStart = 0;
    const domeThetaEnd = Math.PI * 0.5;
    const domeGeometry = new THREE.SphereGeometry(
      domeRadius,
      domeWidthSubdivisions,
      domeHeightSubdivisions,
      domePhiStart,
      domePhiEnd,
      domeThetaStart,
      domeThetaEnd
    );
    const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
    domeMesh.castShadow = true;
    bodyMesh.add(domeMesh);
    domeMesh.position.y = 0.5;

    const turretWidth = 0.1;
    const turretHeight = 0.1;
    const turretLength = carLength * 0.75 * 0.2;
    const turretGeometry = new THREE.BoxGeometry(turretWidth, turretHeight, turretLength);
    const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
    const turretPivot = new THREE.Object3D();
    turretMesh.castShadow = true;
    turretPivot.scale.set(5, 5, 5);
    turretPivot.position.y = 0.5;
    turretMesh.position.z = turretLength * 0.5;
    turretPivot.add(turretMesh);
    bodyMesh.add(turretPivot);

    const turretCamera = makePCamera();
    turretCamera.position.y = 0.75 * 0.2;
    turretMesh.add(turretCamera);

    // 目标物
    const targetGeometry = new THREE.SphereGeometry(0.5, 6, 3);
    const targetMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      flatShading: true,
    });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    const targetOrbit = new THREE.Object3D(); // 一个Object3D元素就是一个坐标系, 利用相对自身坐标系来设置物品位置; 而不是使用世界坐标位置
    const targetElevation = new THREE.Object3D();
    const targetBob = new THREE.Object3D();
    targetMesh.castShadow = true;
    scene.add(targetOrbit); // 以世界坐标系原点为基准
    targetOrbit.add(targetElevation); // 以targetOrbit坐标系原点为基准
    targetElevation.position.z = carLength * 2;
    targetElevation.position.y = 8;
    targetElevation.add(targetBob); // 以targetElevation坐标系原点为基准
    targetBob.add(targetMesh); // 以targetBob坐标系原点为基准

    const targetCamera = makePCamera();
    const targetCameraPivot = new THREE.Object3D();
    targetCamera.position.x = 1;
    targetCamera.position.z = -2;
    targetCamera.rotation.y = Math.PI;
    targetBob.add(targetCameraPivot); // 以targetBob坐标系原点为基准; targetCameraPivot坐标系的原点位置是targetBob坐标系中的点(1, Math.PI, -2)
    targetCameraPivot.add(targetCamera);

    // 线路
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(-10, 0),
      new THREE.Vector2(-5, 5),
      new THREE.Vector2(0, 0),
      new THREE.Vector2(5, -5),
      new THREE.Vector2(10, 0),
      new THREE.Vector2(5, 10),
      new THREE.Vector2(-5, 10),
      new THREE.Vector2(-10, -10),
      new THREE.Vector2(-15, -8),
      new THREE.Vector2(-10, 0),
    ]);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const splineObject = new THREE.Line(geometry, material);
    splineObject.rotation.x = Math.PI * 0.5;
    splineObject.position.y = 0.05;
    scene.add(splineObject);

    const targetPosition = new THREE.Vector3();
    const tankPosition = new THREE.Vector2();
    const tankTarget = new THREE.Vector2();

    const cameras = [
      { cam: camera, desc: "detached camera" },
      { cam: turretCamera, desc: "on turret looking at target" },
      { cam: targetCamera, desc: "near target looking at tank" },
      { cam: tankCamera, desc: "above back of tank" },
    ];

    function render(time: number) {
      time *= 0.001;
      if (resizeRendererToDisplaySize(renderer, canvas)) {
        cameras.forEach((cameraInfo) => {
          const camera = cameraInfo.cam;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        });
      }

      // move target
      targetOrbit.rotation.y = time * 0.27; // 初始值 => 在scene中未移动，原点即世界坐标系原点
      targetBob.position.y = Math.sin(time * 2) * 4; // 跟随targetOrbit运动； 初始值 => 在targetElevation未移动；而targetElevation在targetOrbit坐标系中移动; 原点即世界坐标系点(0，8，16)；
      targetMesh.rotation.x = time * 7; // 跟随targetBob运动； 初始值 => 在targetBob中未移动, 原点即世界坐标系点(0，8，16)；
      targetMesh.rotation.y = time * 13;
      targetMaterial.emissive.setHSL((time * 10) % 1, 1, 0.25);
      targetMaterial.color.setHSL((time * 10) % 1, 1, 0.25);

      // move tank
      const tankTime = time * 0.05;
      curve.getPointAt(tankTime % 1, tankPosition); // 坦克当前位置
      curve.getPointAt((tankTime + 0.01) % 1, tankTarget); // tankTime + 0.01; 坦克前进路线位置
      tank.position.set(tankPosition.x, 0, tankPosition.y);
      tank.lookAt(tankTarget.x, 0, tankTarget.y); // 使得坦克始终 朝向前方

      // face turret at target
      targetMesh.getWorldPosition(targetPosition); // 获取target在世界坐标系中位置
      turretPivot.lookAt(targetPosition); // 使得炮台始终 朝向target

      // make the turretCamera look at target
      turretCamera.lookAt(targetPosition); // 使得炮台相机 指向target; 从炮台处观察目标

      // make the targetCameraPivot look at the at the tank
      tank.getWorldPosition(targetPosition); // 获取坦克在世界坐标系中位置
      targetCameraPivot.lookAt(targetPosition); // 使得target相机 指向坦克; 从目标处观察坦克

      wheelMeshes.forEach((obj) => {
        obj.rotation.x = time * 3;
      });

      const camera = cameras[(time * 0.25) % cameras.length | 0]; // 交替渲染相机
      console.log("camera =>", camera.desc);
      renderer.render(scene, camera.cam);

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
