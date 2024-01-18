#version 300 es
precision mediump float;// 必须设置精度

in vec2 TexCoord;
out vec4 FragColor;

// 一个供纹理对象使用的内建数据类型，叫做采样器
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float mixValue;

void main() {
  // 内建的texture函数来采样纹理的颜色[纹理的（插值）后, 相应纹理坐标上的(过滤后的)颜色]
  FragColor = mix(texture(texture1, TexCoord), texture(texture2, TexCoord), mixValue);
}