#version 300 es

layout(location=0)in vec3 aPos;

void main()
{
  gl_Position=vec4(aPos,1.0);// 顶点位置
  gl_PointSize=10.;// 点的尺寸(像素)
}