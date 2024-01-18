#version 300 es

layout(location = 0) in vec3 aPos; // 顶点坐标
layout(location = 1) in vec2 aTexCoord; // 纹理坐标

out vec2 TexCoord;

void main() {
  gl_Position = vec4(aPos, 1.);
  TexCoord = aTexCoord;
}
