#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation; // 平移量
uniform vec2 u_rotation; // 旋转
uniform vec2 u_scale; // 缩放

void main() {
// 缩放
  vec2 scaledPosition = a_position * u_scale;

  // 旋转位置<逆时针> https://www.jianshu.com/p/2d06cda34c02

  // 此处为顺时针计算
  vec2 rotatedPosition = vec2(
    // rotatedX
  scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
    // rotatedY
  scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);

  // 加上平移
  vec2 position = rotatedPosition + u_translation;

  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0f;
  vec2 clipSpace = zeroToTwo - 1.0f;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
