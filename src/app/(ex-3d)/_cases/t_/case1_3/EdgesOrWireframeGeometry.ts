// 辅助

import * as THREE from "three";
import createExtrudeMesh from "./ExtrudeGeometry";

export function createEdgesLine() {
  // 针对几合体, 生成边缘网格
  const edge = new THREE.EdgesGeometry(createExtrudeMesh().geometry);

  const line = new THREE.LineSegments(
    edge,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  return line;
}

export function createWireframeLine() {
  // 对于给定的几何体，生成每个边包含一个线段（2 个点）的几何体。
  const wireframe = new THREE.WireframeGeometry(createExtrudeMesh().geometry);

  const line = new THREE.LineSegments(
    wireframe,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      depthTest: false,
      opacity: 0.25,
      transparent: true,
    })
  );
  return line;
}
