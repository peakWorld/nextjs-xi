#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;

void main() {
  // 将像素坐标 转成 裁剪空间坐标

  // web环境 Y轴向下正
  vec2 zeroToOne = a_position / u_resolution; // x 0~1 | y 0~1
  vec2 zeroToTwo = zeroToOne * 2.0f; // x 0~2 | y 0~2
  vec2 clipSpace = zeroToTwo - 1.0f; // x -1~+1 | y -1~+1

  // 裁剪空间 Y轴向上正 ｜乘-1反转
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
