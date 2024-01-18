#version 300 es
precision mediump float;// 必须设置精度

struct Material {
  vec3 ambient;   // 在环境光照下表面反射的颜色，通常与表面的颜色相同。
  vec3 diffuse;   // 在漫反射光照下表面的颜色，期望的物体颜色
  vec3 specular;  // 表面上镜面高光的颜色
  float shininess;// 镜面高光的散射/半径
};
uniform Material material;

// 点光源
uniform vec3 pointColor;
uniform vec3 pointPos;

// 镜面光照
uniform vec3 viewPos;

in vec3 v_pos;
in vec3 v_normal;
out vec4 FragColor;

void main() {

  // 环境光
  vec3 ambient = pointColor * material.ambient;

  // 漫反射
  vec3 norm = normalize(v_normal); // 由于v_normal进行了插值, 此时长度不为1
  vec3 lightDir = normalize(pointPos - v_pos); // 实际为: 入射光反方向
  float diff = max(dot(lightDir, norm), 0.0f); // cosθ值
  vec3 diffuse = pointColor * (diff * material.diffuse);

  // 镜面光
  vec3 viewDir = normalize(viewPos - v_pos);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
  vec3 specular = pointColor * (spec * material.specular);

  FragColor = vec4(ambient + diffuse + specular, 1.0f);
}
