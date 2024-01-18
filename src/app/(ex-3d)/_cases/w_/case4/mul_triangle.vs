#version 300 es

layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aColor;

out vec3 color;

uniform mat4 view;
// uniform mat4 projection;

void main() {
  gl_Position = view * vec4(aPos, 1.);

  // 补回缺失的角
  // gl_Position = projection * view * vec4(aPos, 1.);

  color = aColor;
}
