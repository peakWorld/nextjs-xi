import * as THREE from "three";

export default function createMesh() {
  // 一条边
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
  }

  // 将边围绕Y轴旋转
  const geometry = new THREE.LatheGeometry(points, 15, 0, Math.PI * 2);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide, // 双面展示
  });

  const lathe = new THREE.Mesh(geometry, material);

  return lathe;
}
