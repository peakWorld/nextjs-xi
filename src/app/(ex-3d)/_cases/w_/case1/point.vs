#version 300 es  // 指定版本

layout(location = 0) in vec3 aPos;

void main() {
  gl_Position = vec4(0, 0, 0, 1.);// 顶点位置
  gl_PointSize = 10.;// 点的尺寸(像素)
}
