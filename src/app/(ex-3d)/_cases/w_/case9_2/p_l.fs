#version 300 es
precision mediump float;// 必须设置精度

uniform sampler2D texture1;
in vec2 v_coord;
out vec4 FragColor;

void main() {
  FragColor = texture(texture1, v_coord);
}
