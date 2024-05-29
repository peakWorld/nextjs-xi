#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution; // 窗口大小<绘制区域｜像素>
uniform float u_flipY; // 翻转y轴 -1翻转 1不翻转

out vec2 v_texCoord;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0f;
  vec2 clipSpace = zeroToTwo - 1.0f;
  gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

  v_texCoord = a_texCoord;
}
