#version 300 es

layout(location = 0) in vec4 aPos;
layout(location = 1) in vec4 aColor;
layout(location = 2) in vec4 aNormal;

uniform mat4 mvp;
uniform mat4 modelMat; // 模型矩阵
uniform mat4 normalMat; // 模型矩阵的逆转置矩阵

out vec4 v_color;
out vec3 v_pos;
out vec3 v_normal;

void main() {
  gl_Position = mvp * aPos;

  v_normal = normalize(vec3(normalMat * aNormal)); // 逆转置后法向量
  v_pos = vec3(modelMat * aPos);  // 世界坐标
  v_color = aColor;
}
