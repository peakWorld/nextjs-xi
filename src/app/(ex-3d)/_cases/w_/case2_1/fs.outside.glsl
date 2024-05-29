#version 300 es
precision highp float;

in vec2 v_texCoord; // 纹理坐标<经过插值处理>

uniform sampler2D u_image; // 纹理单元序号

out vec4 outColor;

void main() {
  // textureSize 获取纹理尺寸; 计算1个像素相当于纹理坐标<0～1.0>的宽度
  vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));

  // 纹理坐标向右移动一个像素
  // 纹理坐标向左移动一个像素
  // 取3个像素的平均值作为当前像素的颜色值
  outColor = (texture(u_image, v_texCoord) +
    texture(u_image, v_texCoord + vec2(onePixel.x, 0.0f)) +
    texture(u_image, v_texCoord + vec2(-onePixel.x, 0.0f))) / 3.0f;
}
