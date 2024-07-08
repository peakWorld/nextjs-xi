#version 300 es
precision highp float;

// 从顶点着色器传递过来颜色
in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}
