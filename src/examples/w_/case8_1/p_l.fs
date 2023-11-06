#version 300 es
precision mediump float;// 必须设置精度

uniform sampler2D diffuse;
uniform sampler2D specular;
uniform sampler2D reflection;
uniform sampler2D ddnt;

in vec2 v_coord;
out vec4 FragColor;

void main() {
  vec3 diff = texture(diffuse, v_coord).rgb;
  vec3 spec = texture(specular, v_coord).rgb;
  vec3 refl = texture(reflection, v_coord).rgb;
  vec3 ddn = texture(ddnt, v_coord).rgb;

  FragColor = vec4(diff + spec + refl + ddn, 1.0f);
}
