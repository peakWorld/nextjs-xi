#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_mvp;
uniform mat4 u_inverseTranspose;

out vec3 v_normal;

void main() {
  gl_Position = u_mvp * a_position;

  // 在物体变化时, 重定向法向量<忽略 位移; 考虑旋转、缩放>
  // 世界矩阵的逆转值矩阵<侧重解决缩放>
  v_normal = mat3(u_inverseTranspose) * a_normal;
}
