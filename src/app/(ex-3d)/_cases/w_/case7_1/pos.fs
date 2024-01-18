#version 300 es
precision mediump float;// 必须设置精度

uniform vec3 color; // 光色

out vec4 FragColor;

void main() {
  FragColor = vec4(color, 1.0f);
}
