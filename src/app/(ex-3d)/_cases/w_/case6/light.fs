#version 300 es
precision mediump float;// 必须设置精度

uniform vec3 lightColor; // 光色
uniform vec3 lightPos; // 光源位置
uniform vec3 lightAmb; // 环境光

in vec4 v_color;
in vec3 v_pos;
in vec3 v_normal;
out vec4 FragColor;

void main() {

  // 光的反射方向
  vec3 lightDir = normalize(lightPos - v_pos);
  // cosO值; 由于v_normal进行了插值, 此时长度不为1
  float nDot = max(dot(lightDir, normalize(v_normal)), 0.0f);

  vec3 diffuse = lightColor * v_color.rgb * nDot; // 点光源色彩
  vec3 ambient = lightAmb * v_color.rgb; // 环境光色彩

  FragColor = vec4(diffuse + ambient, v_color.a);
}
