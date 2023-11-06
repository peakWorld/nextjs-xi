#version 300 es
precision mediump float;// 必须设置精度

// 材质
struct Material {
  sampler2D diffuse;
  sampler2D specular;
  float shininess;
};

// 平行光
struct DirLight {
  vec3 direction;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

// 点光源
struct PointLight {
  vec3 position;

  float constant;
  float linear;
  float quadratic;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

// 聚光
struct SpotLight {
  vec3 position;
  vec3 direction;
  float cutOff;
  float outerCutOff;

  float constant;
  float linear;
  float quadratic;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

#define NR_POINT_LIGHTS 4

in vec2 v_coord;
in vec3 v_pos;
in vec3 v_normal;
out vec4 FragColor;

uniform DirLight dirLight;
uniform PointLight pointLights[NR_POINT_LIGHTS];
uniform SpotLight spotLight;
uniform Material material;
uniform vec3 viewPos;

vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir);
vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);
vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

void main() {
  // properties
  vec3 norm = normalize(v_normal);
  vec3 viewDir = normalize(viewPos - v_pos);

  // phase 1: directional lighting
  vec3 result = CalcDirLight(dirLight, norm, viewDir);
  // phase 2: point lights
  for(int i = 0; i < NR_POINT_LIGHTS; i++) result += CalcPointLight(pointLights[i], norm, v_pos, viewDir);
  // phase 3: spot light
  result += CalcSpotLight(spotLight, norm, v_pos, viewDir);

  FragColor = vec4(result, 1.0f);
}

vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir) {
  vec3 lightDir = normalize(-light.direction);
  // diffuse shading
  float diff = max(dot(normal, lightDir), 0.0f);
  // specular shading
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
  // combine results
  vec3 ambient = light.ambient * vec3(texture(material.diffuse, v_coord));
  vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, v_coord));
  vec3 specular = light.specular * spec * vec3(texture(material.specular, v_coord));
  return (ambient + diffuse + specular);
}

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir) {
  vec3 lightDir = normalize(light.position - fragPos);
  // diffuse shading
  float diff = max(dot(normal, lightDir), 0.0f);
  // specular shading
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
  // attenuation
  float distance = length(light.position - fragPos);
  float attenuation = 1.0f / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
  // combine results
  vec3 ambient = light.ambient * vec3(texture(material.diffuse, v_coord));
  vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, v_coord));
  vec3 specular = light.specular * spec * vec3(texture(material.specular, v_coord));
  ambient *= attenuation;
  diffuse *= attenuation;
  specular *= attenuation;
  return (ambient + diffuse + specular);
}

vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir) {
  vec3 lightDir = normalize(light.position - fragPos);
  // diffuse shading
  float diff = max(dot(normal, lightDir), 0.0f);
  // specular shading
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
  // attenuation
  float distance = length(light.position - fragPos);
  float attenuation = 1.0f / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
  // spotlight intensity
  float theta = dot(lightDir, normalize(-light.direction));
  float epsilon = light.cutOff - light.outerCutOff;
  float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0f, 1.0f);
  // combine results
  vec3 ambient = light.ambient * vec3(texture(material.diffuse, v_coord));
  vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, v_coord));
  vec3 specular = light.specular * spec * vec3(texture(material.specular, v_coord));
  ambient *= attenuation * intensity;
  diffuse *= attenuation * intensity;
  specular *= attenuation * intensity;
  return (ambient + diffuse + specular);
}
