#version 300 es
precision mediump float;// 必须设置精度

// 材质
struct Material {
  sampler2D diffuse;
  sampler2D specular;
  float shininess;
};

// 光照
struct Light {
  vec3 position;
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;

  float constant;
  float linear;
  float quadratic;
};

in vec2 v_coord;
in vec3 v_pos;
in vec3 v_normal;
out vec4 FragColor;

uniform Light light;
uniform Material material;
uniform vec3 viewPos;

void main() {

  // 环境光: 环境光颜色在几乎所有情况下都等于漫反射颜色
  vec3 ambient = light.ambient * texture(material.diffuse, v_coord).rgb;

  // 漫反射
  vec3 norm = normalize(v_normal);
  vec3 lightDir = normalize(light.position - v_pos);
  float diff = max(dot(lightDir, norm), 0.0f);
  vec3 diffuse = light.diffuse * diff * texture(material.diffuse, v_coord).rgb;

  // 镜面光
  vec3 viewDir = normalize(viewPos - v_pos);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
  vec3 specular = light.specular * spec * texture(material.specular, v_coord).rgb;

  // 衰减系数
  float distance = length(light.position - v_pos); // 获取片段和光源之间的向量差，并获取结果向量的长度作为距离项
  float attenuation = 1.0f / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

  ambient *= attenuation;
  diffuse *= attenuation;
  specular *= attenuation;

  FragColor = vec4(ambient + diffuse + specular, 1.0f);
}
