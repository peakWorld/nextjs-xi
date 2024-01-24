import * as THREE from "three";

const loader = new THREE.TextureLoader();

export function resizeRendererToDisplaySize(
  renderer: THREE.WebGLRenderer,
  canvas: HTMLCanvasElement
) {
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
  const ctx = document
    .createElement("canvas")
    .getContext("2d") as CanvasRenderingContext2D;
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
