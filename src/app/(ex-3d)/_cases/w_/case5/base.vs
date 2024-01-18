#version 300 es

layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aColor;

out vec3 color;
uniform mat4 mvp;

void main() {
  // p * v * m
  gl_Position = mvp * vec4(aPos, 1.);
  color = aColor;
}
