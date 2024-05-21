#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;

void main() {
  // 将像素坐标 转成 裁剪空间坐标
  vec2 zeroToOne = a_position / u_resolution; // 0~1
  vec2 zeroToTwo = zeroToOne * 2.0f; // 0~2
  vec2 clipSpace = zeroToTwo - 1.0f; // -1~+1

  // 裁剪空间Y轴 向上正、向下负
  // 屏幕空间Y轴 向下正
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
