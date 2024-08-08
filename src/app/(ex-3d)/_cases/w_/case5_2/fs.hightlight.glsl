#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
uniform float u_shininess;

out vec4 outColor;

void main() {
  // 插值 归一化为单位向量
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);

  // 通过取法线与光线反向的点积计算光
  float diffuse = dot(normal, surfaceToLightDirection);

  vec3 reflectDir = reflect(-surfaceToLightDirection, normal);
  // 相机方向与反射方向的点积计算高光, 大于90度就看不到高光了
  float specular = pow(max(dot(surfaceToViewDirection, reflectDir), 0.0f), u_shininess);

  outColor = vec4((diffuse + specular) * u_color.rgb, 1.0f);
}
