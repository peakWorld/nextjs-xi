#version 300 es
precision mediump float;// 必须设置精度

in vec3 color;
out vec4 FragColor;

void main(){
  // 内建的texture函数来采样纹理的颜色[纹理的（插值）后, 相应纹理坐标上的(过滤后的)颜色]
  FragColor=vec4(color,1.);
}