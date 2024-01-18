#version 300 es
precision mediump float;// 必须设置精度

in vec3 color;
out vec4 FragColor;

void main() {
  FragColor = vec4(color, 1.0);
}
