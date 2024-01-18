#version 300 es

layout(location = 0) in vec4 aPos;
layout(location = 2) in vec2 aCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec2 v_coord;

void main() {
  gl_Position = projection * view * model * aPos;
  v_coord = aCoord;
}
