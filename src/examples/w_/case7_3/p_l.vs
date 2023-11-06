#version 300 es

layout(location = 0) in vec4 aPos;
layout(location = 1) in vec4 aNormal;
layout(location = 2) in vec2 aCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform mat4 normal; // 模型矩阵的逆转置矩阵

out vec3 v_pos;
out vec3 v_normal;
out vec2 v_coord;

void main() {
  gl_Position = projection * view * model * aPos;

  v_normal = normalize(vec3(normal * aNormal));
  v_pos = vec3(model * aPos);
  v_coord = aCoord;
}
