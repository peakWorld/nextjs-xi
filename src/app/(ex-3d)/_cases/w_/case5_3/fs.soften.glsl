#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
uniform float u_shininess;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;
uniform vec3 u_lightDirection;
uniform float u_innerLimit;
uniform float u_outerLimit;

out vec4 outColor;

void main() {
  // 插值 归一化为单位向量
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);

  // 漫反射
  float diff = max(dot(normal, surfaceToLightDirection), 0.0f);

  // 镜面光
  vec3 reflectDir = reflect(-surfaceToLightDirection, normal);
  // 相机方向与反射方向的点积计算高光, 大于90度就看不到高光了
  float spec = pow(max(dot(surfaceToViewDirection, reflectDir), 0.0f), u_shininess);

  // 聚光 dot => cos
  float theta = dot(surfaceToLightDirection, normalize(-u_lightDirection));
  float epsilon = u_innerLimit - u_outerLimit;
  float intensity = clamp((theta - u_outerLimit) / epsilon, 0.0f, 1.0f);

  vec3 diffuse = u_lightColor * diff * intensity;
  vec3 specular = u_specularColor * spec * intensity;

  // 最终颜色
  outColor = vec4((diffuse + specular) * u_color.rgb, u_color.a);
}
