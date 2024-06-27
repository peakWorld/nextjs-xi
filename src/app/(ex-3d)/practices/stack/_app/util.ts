import * as THREE from "three";

export interface BoxParams {
  width: number;
  height: number;
  depth: number;
  x: number;
  y: number;
  z: number;
  color: string;
}

export function createBox(prams: Partial<BoxParams> = {}) {
  const { width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, color = "#d9dfc8" } = prams;
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshToonMaterial({ color });
  const box = new THREE.Mesh(geometry, material);
  box.position.set(x, y, z);
  return box;
}
