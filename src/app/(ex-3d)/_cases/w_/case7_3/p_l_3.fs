#version 300 es
precision mediump float;// 必须设置精度

// 材质
struct Material {
  sampler2D diffuse;
  sampler2D specular;
  sampler2D emissive; // 放射光贴图
  float shininess;
};

// 光照
struct Light {
  vec3 position;
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
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

  // 放射光贴图
  vec3 emissive = texture(material.emissive, v_coord).rgb;

  FragColor = vec4(ambient + diffuse + specular + emissive, 1.0f);
}
