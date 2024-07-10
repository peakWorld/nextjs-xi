#version 300 es

in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

uniform mat4 u_matrix;
uniform float u_fudgeFactor; // 缩放因子, 控制远小近大比例

void main() {
  vec4 position = u_matrix * a_position;

  // z值缩放<0~2.0>
  float zToDivideBy = 1.0f + position.z * u_fudgeFactor;

  // gl_Position = vec4(position.xy / zToDivideBy, position.zw);

  // webgl自动处以w值
  gl_Position = vec4(position.xyz, zToDivideBy);

  v_color = a_color;
}
