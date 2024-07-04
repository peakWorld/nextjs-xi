import * as THREE from "three";
import type { BoxParams } from "./interface";

export function createBox(prams: Partial<BoxParams> = {}) {
  const { width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, color = "#d9dfc8" } = prams;
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshToonMaterial({ color });
  const box = new THREE.Mesh(geometry, material);
  box.position.set(x, y, z);
  return box;
}

// 在取值范围[min, max]内随机一个整数
export function randomIntegerInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function updateColor(level: number, offset: number) {
  const val = (level + offset) * 0.25;
  const r = (Math.sin(val) * 55 + 200) / 255;
  const g = (Math.sin(val + 2) * 55 + 200) / 255;
  const b = (Math.sin(val + 4) * 55 + 200) / 255;
  return new THREE.Color(r, g, b);
}

// 是否是奇数
export function isOdd(value: number) {
  return value % 2 == 1;
}
