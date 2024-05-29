#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation; // 平移量

void main() {
  vec2 position = a_position + u_translation; // 平移后的点再进行归一化处理

  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0f;
  vec2 clipSpace = zeroToTwo - 1.0f;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
