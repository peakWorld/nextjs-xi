"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { resizeRendererToDisplaySize, randInt, getCanvasRelativePosition } from "@/app/(ex-3d)/_utils/t_/common";
import { VoxelWorld } from "./mulCell";
import "./mul.scss";

export default function Case4_15() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const cellSize = 32;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("lightblue");

    const fov = 75;
    const aspect = 2; // 默认canvas的宽高比
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-cellSize * 0.3, cellSize * 0.8, -cellSize * 0.3);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(cellSize / 2, cellSize / 3, cellSize / 2);
    controls.update();

    function addLight(x: number, y: number, z: number) {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(x, y, z);
      scene.add(light);
    }

    addLight(-1, 2, 4);
    addLight(1, -1, -2);

    // 加载纹理
    const loader = new THREE.TextureLoader();
    const texture = loader.load("/t_/flourish-cc-by-nc-sa.png", render);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    const tileSize = 16;
    const tileTextureWidth = 256;
    const tileTextureHeight = 64;
    const world = new VoxelWorld({
      cellSize,
      tileSize,
      tileTextureWidth,
      tileTextureHeight,
    });

    const material = new THREE.MeshLambertMaterial({
      map: texture,
      side: THREE.DoubleSide,
      alphaTest: 0.1,
      transparent: true,
    });

    const cellIdToMesh: Record<string, THREE.Mesh> = {};
    function updateCellGeometry(x: number, y: number, z: number) {
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);
      const cellZ = Math.floor(z / cellSize);
      const cellId = world.computeCellId(x, y, z);
      let mesh = cellIdToMesh[cellId];
      const geometry = mesh ? mesh.geometry : new THREE.BufferGeometry();
      // 在cell中的某个体素改变, 该体素周边的面必定发生变化; 那么position、normal、uv都发生改变
      // 需要重新计算geometry
      const { positions, normals, uvs, indices } = world.generateGeometryDataForCell(cellX, cellY, cellZ);
      const positionNumComponents = 3;
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
      const normalNumComponents = 3;
      geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
      const uvNumComponents = 2;
      geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
      geometry.setIndex(indices);
      geometry.computeBoundingSphere();

      if (!mesh) {
        mesh = new THREE.Mesh(geometry, material);
        mesh.name = cellId;
        cellIdToMesh[cellId] = mesh;
        scene.add(mesh);
        mesh.position.set(cellX * cellSize, cellY * cellSize, cellZ * cellSize);
      }
    }

    const neighborOffsets = [
      [0, 0, 0], // self
      [-1, 0, 0], // left
      [1, 0, 0], // right
      [0, -1, 0], // down
      [0, 1, 0], // up
      [0, 0, -1], // back
      [0, 0, 1], // front
    ];
    function updateVoxelGeometry(x: number, y: number, z: number) {
      const updatedCellIds: Record<string, boolean> = {};
      // 判断该位置的六个面
      for (const offset of neighborOffsets) {
        const ox = x + offset[0];
        const oy = y + offset[1];
        const oz = z + offset[2];
        const cellId = world.computeCellId(ox, oy, oz);
        // 更新该Cell的geometry, 而相同的CellId只更新(或创建)一次
        if (!updatedCellIds[cellId]) {
          updatedCellIds[cellId] = true;
          updateCellGeometry(ox, oy, oz);
        }
      }
    }

    // 给区块Cell对象中体素预先填充数据
    for (let y = 0; y < cellSize; ++y) {
      for (let z = 0; z < cellSize; ++z) {
        for (let x = 0; x < cellSize; ++x) {
          const height =
            (Math.sin((x / cellSize) * Math.PI * 2) + Math.sin((z / cellSize) * Math.PI * 3)) * (cellSize / 6) +
            cellSize / 2;
          if (y < height) {
            // randInt(1, 17) 体素的纹理U值
            world.setVoxel(x, y, z, randInt(1, 17));
          }
        }
      }
    }
    updateVoxelGeometry(1, 1, 1);

    let renderRequested = false;
    function render() {
      renderRequested = false;

      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      controls.update();
      renderer.render(scene, camera);
    }
    render();

    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
      }
    }

    let currentVoxel = 0;
    let currentId = "";

    document.querySelectorAll("#ui .tiles input[type=radio][name=voxel]").forEach((elem) => {
      elem.addEventListener("click", allowUncheck);
    });

    function allowUncheck() {
      // @ts-ignore
      const that = this;
      if (that.id === currentId) {
        that.checked = false;
        currentId = "";
        currentVoxel = 0;
      } else {
        currentId = that.id;
        currentVoxel = parseInt(that.value);
      }
    }

    function placeVoxel(event: MouseEvent) {
      const pos = getCanvasRelativePosition(event, canvas);
      const x = (pos.x / canvas.width) * 2 - 1;
      const y = (pos.y / canvas.height) * -2 + 1;

      const start = new THREE.Vector3();
      const end = new THREE.Vector3();
      start.setFromMatrixPosition(camera.matrixWorld); // 相机的世界坐标 start === camera.position
      end.set(x, y, 1).unproject(camera); // 获取世界坐标

      const intersection = world.intersectRay(start, end); // 获取选中的面
      if (intersection) {
        const voxelId = event.shiftKey ? 0 : currentVoxel;

        // 如果voxelId大于0, 该坐标沿着法向量方向移动0.5个标准单位 => 将新增的体素位置<在Cell中>
        // 如果voxelId等于0, 沿着法向量反方向移动0.5个标准单位 => 该体素的位置<在Cell中>
        const pos = intersection.position.map((v, ndx) => {
          return v + intersection.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
        }) as [number, number, number];

        // 更新选中面 其所对应体素的纹理U值;
        // 在generateGeometryDataForCell函数中, voxelId=0表示不再渲染该体素<即删除>
        world.setVoxel(...pos, voxelId);
        updateVoxelGeometry(...pos);
        requestRenderIfNotRequested();
      }
    }

    const mouse = {
      x: 0,
      y: 0,
      moveX: 0,
      moveY: 0,
    };

    // 记录鼠标开始位置(按下)
    function recordStartPosition(event: MouseEvent) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.moveX = 0;
      mouse.moveY = 0;
    }

    // 记录鼠标移动距离
    function recordMovement(event: MouseEvent) {
      mouse.moveX += Math.abs(mouse.x - event.clientX);
      mouse.moveY += Math.abs(mouse.y - event.clientY);
    }

    // 鼠标(放开)
    function placeVoxelIfNoMovement(event: MouseEvent) {
      // 移动距离少于5, 则更新体素
      if (mouse.moveX < 5 && mouse.moveY < 5) {
        placeVoxel(event);
      }

      window.removeEventListener("pointermove", recordMovement, false);
      window.removeEventListener("pointerup", placeVoxelIfNoMovement, false);
    }

    function pointerdown(event: MouseEvent) {
      event.preventDefault();
      recordStartPosition(event);
      window.addEventListener("pointermove", recordMovement, false);
      window.addEventListener("pointerup", placeVoxelIfNoMovement, false);
    }

    // 鼠标左键按下
    canvas.addEventListener("pointerdown", pointerdown, { passive: false });
    controls.addEventListener("change", requestRenderIfNotRequested);
    window.addEventListener("resize", requestRenderIfNotRequested);

    return () => {
      renderer.dispose();
      document.querySelector(".lil-gui")?.remove();
      canvas.removeEventListener("pointerdown", pointerdown);
      controls.removeEventListener("change", requestRenderIfNotRequested);
      window.removeEventListener("resize", requestRenderIfNotRequested);
      document.querySelectorAll("#ui .tiles input[type=radio][name=voxel]").forEach((elem) => {
        elem.removeEventListener("click", allowUncheck);
      });
    };
  }, []);

  return (
    <div className="case4_15_mul w-full h-full">
      <canvas ref={ref} className="w-full h-full" />
      <div id="ui">
        <div className="tiles">
          <input type="radio" name="voxel" id="voxel1" value="1" />
          <label htmlFor="voxel1" style={{ backgroundPosition: "-0% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel2" value="2" />
          <label htmlFor="voxel2" style={{ backgroundPosition: "-100% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel3" value="3" />
          <label htmlFor="voxel3" style={{ backgroundPosition: "-200% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel4" value="4" />
          <label htmlFor="voxel4" style={{ backgroundPosition: "-300% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel5" value="5" />
          <label htmlFor="voxel5" style={{ backgroundPosition: "-400% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel6" value="6" />
          <label htmlFor="voxel6" style={{ backgroundPosition: "-500% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel7" value="7" />
          <label htmlFor="voxel7" style={{ backgroundPosition: "-600% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel8" value="8" />
          <label htmlFor="voxel8" style={{ backgroundPosition: "-700% -0%" }}></label>
        </div>
        <div className="tiles">
          <input type="radio" name="voxel" id="voxel9" value="9" />
          <label htmlFor="voxel9" style={{ backgroundPosition: "-800% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel10" value="10" />
          <label htmlFor="voxel10" style={{ backgroundPosition: "-900% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel11" value="11" />
          <label htmlFor="voxel11" style={{ backgroundPosition: "-1000% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel12" value="12" />
          <label htmlFor="voxel12" style={{ backgroundPosition: "-1100% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel13" value="13" />
          <label htmlFor="voxel13" style={{ backgroundPosition: "-1200% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel14" value="14" />
          <label htmlFor="voxel14" style={{ backgroundPosition: "-1300% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel15" value="15" />
          <label htmlFor="voxel15" style={{ backgroundPosition: "-1400% -0%" }}></label>
          <input type="radio" name="voxel" id="voxel16" value="16" />
          <label htmlFor="voxel16" style={{ backgroundPosition: "-1500% -0%" }}></label>
        </div>
      </div>
    </div>
  );
}
