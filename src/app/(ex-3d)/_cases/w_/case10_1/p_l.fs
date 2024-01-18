#version 300 es
precision mediump float;// 必须设置精度

uniform sampler2D texture1;
in vec2 v_coord;
out vec4 FragColor;

void main() {
  vec4 texColor = texture(texture1, v_coord);
  if(texColor.a < 0.1f)
    discard; // 保证片段不会被进一步处理，所以就不会进入颜色缓冲
  FragColor = texColor;
}
