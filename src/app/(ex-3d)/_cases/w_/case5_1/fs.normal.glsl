#version 300 es
precision highp float;

in vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

out vec4 outColor;

void main() {
  // 插值 归一化为单位向量
  vec3 normal = normalize(v_normal);

  // 通过取法线与光线反向的点积计算光
  float diffuse = dot(normal, u_reverseLightDirection);

  outColor = u_color;

  // 只将颜色部分（不是 alpha）乘以光
  outColor.rgb *= diffuse;
}
