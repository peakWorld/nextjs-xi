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

// 加载模型后, 自动对齐相机
export function frameArea(sizeToFitOnScreen: number, boxSize: number, boxCenter: THREE.Vector3, camera: THREE.Camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY); // 计算(New)相机到模型中心的距离

  // 计算模型中心和原相机间的 单位向量
  // const direction = new THREE.Vector3().subVectors(camera.position, boxCenter).normalize();
  const direction = new THREE.Vector3()
    .subVectors(camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1)) // 抹除y轴方向的缩放, 保证平行XZ平面(即地面)
    .normalize();

  // 模型中心 + 单位向量 * 距离 = 新相机位置
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;
  camera.updateProjectionMatrix();
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

export async function loadJSON(url: string) {
  const req = await fetch(url);
  return req.json();
}

export function getCanvasRelativePosition(event: MouseEvent | Touch, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  // canvas.width 画布横轴像素值；rect.width canvas元素宽度
  // 将屏幕尺寸坐标转化为对应的像素坐标
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  } as THREE.Vector2;
}

export function get255BasedColor(color: string) {
  const tempColor = new THREE.Color();
  tempColor.set(color);
  const base = tempColor.toArray().map((v) => v * 255);
  base.push(255); // alpha
  return base;
}

export function randInt(min: number, max?: number) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return (Math.random() * (max - min) + min) | 0;
}

// canvas 2D绘制随机圆圈
export function drawRandomDot(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = `#${randInt(0x1000000).toString(16).padStart(6, "0")}`;
  ctx.beginPath();

  const x = randInt(256);
  const y = randInt(256);
  const radius = randInt(10, 64);
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}
