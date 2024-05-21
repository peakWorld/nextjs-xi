#version 300 es
precision highp float;

out vec4 outColor;

in vec4 v_color; // varying, 与顶点着色器中相同名称和类型

void main() {
  outColor = v_color;
}
