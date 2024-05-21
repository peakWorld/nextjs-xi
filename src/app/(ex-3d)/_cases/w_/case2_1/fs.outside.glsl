#version 300 es
precision highp float;

in vec2 v_texCoord; // 纹理坐标<经过插值处理>

uniform sampler2D u_image; // 纹理单元序号

out vec4 outColor;

void main() {
  outColor = texture(u_image, v_texCoord);
}
