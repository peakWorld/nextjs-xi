import * as THREE from "three";

const loader = new THREE.TextureLoader();

export function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer, canvas: HTMLCanvasElement) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export function makePCamera(fov = 40) {
  const aspect = 2; // the canvas default
  const zNear = 0.1;
  const zFar = 1000;
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}

export function loadTextureAndPromise(url: string) {
  let textureResolve: (value: unknown) => void;
  const promise = new Promise((resolve) => {
    textureResolve = resolve;
  });
  const texture = loader.load(url, (texture) => {
    textureResolve(texture);
  });
  return {
    texture,
    promise,
  };
}

// 和文件夹public/t_/mips中图片一样, 梯度mips
export function createMip(level: number, numLevels: number, scale = 1) {
  const u = level / numLevels;
  const size = 2 ** (numLevels - level - 1);
  const halfSize = Math.ceil(size / 2);
  const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
  ctx.canvas.width = size * scale;
  ctx.canvas.height = size * scale;
  ctx.scale(scale, scale);
  ctx.fillStyle = `hsl(${(180 + u * 360) | 0},100%,20%)`;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = `hsl(${(u * 360) | 0},100%,50%)`;
  ctx.fillRect(0, 0, halfSize, halfSize);
  ctx.fillRect(halfSize, halfSize, halfSize, halfSize);
  return ctx.canvas;
}

// 打印节点树型结构
function dumpVec3(v3: THREE.Vector3 | THREE.Euler, precision = 3) {
  return `${v3.x.toFixed(precision)}, ${v3.y.toFixed(precision)}, ${v3.z.toFixed(precision)}`;
}
export function dumpObject(obj: THREE.Object3D, lines: string[] = [], isLast = true, prefix = "") {
  const localPrefix = isLast ? "└─" : "├─";
  lines.push(`${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${obj.type}]`);
  const dataPrefix = obj.children.length ? (isLast ? "  │ " : "│ │ ") : isLast ? "    " : "│   ";
  lines.push(`${prefix}${dataPrefix}  pos: ${dumpVec3(obj.position)}`);
  lines.push(`${prefix}${dataPrefix}  rot: ${dumpVec3(obj.rotation)}`);
  lines.push(`${prefix}${dataPrefix}  scl: ${dumpVec3(obj.scale)}`);
  const newPrefix = prefix + (isLast ? "  " : "│ ");
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}

export function rand(min: number, max?: number) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}

export function randomColor() {
  return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
}
