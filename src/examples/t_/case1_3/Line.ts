import * as THREE from "three";

// CubicBezierCurve3
export function creatCubicBezierCurve3Line() {
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, -2.5, 0),
    new THREE.Vector3(0, -2.5, 0),
    new THREE.Vector3(-0.5, -5, 0),
    new THREE.Vector3(-2.5, -5, 0)
  );
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const curveLine = new THREE.Line(geometry, material);
  return curveLine;
}
