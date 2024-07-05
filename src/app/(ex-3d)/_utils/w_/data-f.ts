const width = 100;
const height = 150;
const thickness = 30;

// 平面2D F
export function set2DF(x: number, y: number) {
  return new Float32Array([
    // 左竖
    x,
    y,
    x + thickness,
    y,
    x,
    y + height,
    x,
    y + height,
    x + thickness,
    y,
    x + thickness,
    y + height,

    // 上横
    x + thickness,
    y,
    x + width,
    y,
    x + thickness,
    y + thickness,
    x + thickness,
    y + thickness,
    x + width,
    y,
    x + width,
    y + thickness,

    // 中横
    x + thickness,
    y + thickness * 2,
    x + (width * 2) / 3,
    y + thickness * 2,
    x + thickness,
    y + thickness * 3,
    x + thickness,
    y + thickness * 3,
    x + (width * 2) / 3,
    y + thickness * 2,
    x + (width * 2) / 3,
    y + thickness * 3,
  ]);
}

// 3D F, 只是z轴为0
export function set3DF0(x: number, y: number) {
  return new Float32Array([
    // 左竖
    x,
    y,
    0,
    x + thickness,
    y,
    0,
    x,
    y + height,
    0,
    x,
    y + height,
    0,
    x + thickness,
    y,
    0,
    x + thickness,
    y + height,
    0,

    // 上横
    x + thickness,
    y,
    0,
    x + width,
    y,
    0,
    x + thickness,
    y + thickness,
    0,
    x + thickness,
    y + thickness,
    0,
    x + width,
    y,
    0,
    x + width,
    y + thickness,
    0,

    // 中横
    x + thickness,
    y + thickness * 2,
    0,
    x + (width * 2) / 3,
    y + thickness * 2,
    0,
    x + thickness,
    y + thickness * 3,
    0,
    x + thickness,
    y + thickness * 3,
    0,
    x + (width * 2) / 3,
    y + thickness * 2,
    0,
    x + (width * 2) / 3,
    y + thickness * 3,
    0,
  ]);
}
