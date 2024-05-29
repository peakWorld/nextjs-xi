#version 300 es
precision highp float;

in vec2 v_texCoord; // 纹理坐标<经过插值处理>

uniform float u_kernel[9]; // 卷积核
uniform float u_kernelWeight; // 卷积核权重
uniform sampler2D u_image; // 纹理单元序号

out vec4 outColor;

void main() {
  // textureSize 获取纹理尺寸; 计算1个像素相当于纹理坐标<0～1.0>的宽度
  vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));

  vec4 colorSum = texture(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
    texture(u_image, v_texCoord + onePixel * vec2(0, -1)) * u_kernel[1] +
    texture(u_image, v_texCoord + onePixel * vec2(1, -1)) * u_kernel[2] +
    texture(u_image, v_texCoord + onePixel * vec2(-1, 0)) * u_kernel[3] +
    texture(u_image, v_texCoord + onePixel * vec2(0, 0)) * u_kernel[4] +
    texture(u_image, v_texCoord + onePixel * vec2(1, 0)) * u_kernel[5] +
    texture(u_image, v_texCoord + onePixel * vec2(-1, 1)) * u_kernel[6] +
    texture(u_image, v_texCoord + onePixel * vec2(0, 1)) * u_kernel[7] +
    texture(u_image, v_texCoord + onePixel * vec2(1, 1)) * u_kernel[8];
  outColor = vec4((colorSum / u_kernelWeight).rgb, 1);
}
