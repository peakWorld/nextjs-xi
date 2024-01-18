import * as THREE from "three";

export default function createMesh() {
  // xy二维平面
  const outline = new THREE.Shape(
    [
      [-2, -0.1],
      [2, -0.1],
      [2, 0.6],
      [1.6, 0.6],
      [1.6, 0.1],
      [-2, 0.1],
    ].map((p) => new THREE.Vector2(...p))
  );
  // z轴扩展曲线(只能向z轴扩展)
  const x = -2.5;
  const y = -5;
  const shape = new THREE.CurvePath<THREE.Vector3>();
  const points = [
    [x + 2.5, y + 2.5],
    [x + 2.5, y + 2.5],
    [x + 2, y],
    [x, y],
    [x - 3, y],
    [x - 3, y + 3.5],
    [x - 3, y + 3.5],
    [x - 3, y + 5.5],
    [x - 1.5, y + 7.7],
    [x + 2.5, y + 9.5],
    [x + 6, y + 7.7],
    [x + 8, y + 4.5],
    [x + 8, y + 3.5],
    [x + 8, y + 3.5],
    [x + 8, y],
    [x + 5, y],
    [x + 3.5, y],
    [x + 2.5, y + 2.5],
    [x + 2.5, y + 2.5],
  ].map((p) => new THREE.Vector3(...p, 0));
  for (let i = 0; i < points.length; i += 3) {
    shape.add(new THREE.CubicBezierCurve3(...points.slice(i, i + 4)));
  }
  const extrudeSettings = {
    steps: 100,
    bevelEnabled: false,
    extrudePath: shape,
  };
  const geometry = new THREE.ExtrudeGeometry(outline, extrudeSettings);
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
