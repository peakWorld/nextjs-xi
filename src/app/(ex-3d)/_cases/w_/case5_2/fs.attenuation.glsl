#version 300 es
precision highp float;

// 衰减系数
struct Light {
  float constant;
  float linear;
  float quadratic;
};

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
uniform float u_shininess;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;
uniform Light light;

out vec4 outColor;

void main() {
  // 插值 归一化为单位向量
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);

  // 漫反射
  float diff = dot(normal, surfaceToLightDirection);
  vec3 diffuse = u_lightColor * diff;

  // 镜面光
  vec3 reflectDir = reflect(-surfaceToLightDirection, normal);
  // 相机方向与反射方向的点积计算高光, 大于90度就看不到高光了
  float spec = pow(max(dot(surfaceToViewDirection, reflectDir), 0.0f), u_shininess);
  vec3 specular = u_specularColor * spec;

  // 衰减系数
  float distance = length(v_surfaceToLight); // 获取片段和光源之间的向量差，并获取结果向量的长度作为距离项
  float attenuation = 1.0f / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

  // 最终颜色
  vec3 result = (diffuse + specular) * u_color.rgb * attenuation;
  outColor = vec4(result, u_color.a);
}
