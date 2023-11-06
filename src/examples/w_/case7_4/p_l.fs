#version 300 es
precision mediump float;// 必须设置精度

struct Material {
  sampler2D diffuse;
  sampler2D specular;
  float shininess;
};

struct Light {
  vec3 direction; // 平行光, 所有点的光照方向一致
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

  vec3 ambient = light.ambient * texture(material.diffuse, v_coord).rgb;

  // 漫反射
  vec3 norm = normalize(v_normal);
  // 取反？使用光照计算需求一个从片段至光源的光线方向，但更习惯定义定向光为一个从光源出发的全局方向。
  vec3 lightDir = normalize(-light.direction);
  float diff = max(dot(lightDir, norm), 0.0f);
  vec3 diffuse = light.diffuse * diff * texture(material.diffuse, v_coord).rgb;

  // 镜面光
  vec3 viewDir = normalize(viewPos - v_pos);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
  vec3 specular = light.specular * spec * texture(material.specular, v_coord).rgb;

  FragColor = vec4(ambient + diffuse + specular, 1.0f);
}
