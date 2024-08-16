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
uniform vec3 u_lightDirection;
uniform float u_limit;
uniform Light light;

out vec4 outColor;

void main() {
  // 插值 归一化为单位向量
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);

  float diff = 0.0f;
  float spec = 0.0f;

  // 聚光 dot => cos
  float theta = dot(surfaceToLightDirection, normalize(-u_lightDirection));

  // 超出限制范围, 无光
  if(theta >= u_limit) {
    // 漫反射
    diff = max(dot(normal, surfaceToLightDirection), 0.0f);

    // 镜面光
    vec3 reflectDir = reflect(-surfaceToLightDirection, normal);
    // 相机方向与反射方向的点积计算高光, 大于90度就看不到高光了
    spec = pow(max(dot(surfaceToViewDirection, reflectDir), 0.0f), u_shininess);
  }

  vec3 diffuse = u_lightColor * diff;
  vec3 specular = u_specularColor * spec;

  // 衰减系数
  // float distance = length(v_surfaceToLight); // 获取片段和光源之间的向量差，并获取结果向量的长度作为距离项
  // float attenuation = 1.0f / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

  // 最终颜色
  vec3 result = (diffuse + specular) * u_color.rgb;
  outColor = vec4(result, u_color.a);
}
