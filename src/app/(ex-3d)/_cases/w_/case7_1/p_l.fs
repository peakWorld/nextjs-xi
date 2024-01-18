#version 300 es
precision mediump float;// 必须设置精度

// 点光源
uniform vec3 pointColor;
uniform vec3 pointPos;

// 镜面光照
uniform vec3 viewPos;
uniform float specularStren;

// 环境光
uniform float ambStren;

in vec4 v_color;
in vec3 v_pos;
in vec3 v_normal;
out vec4 FragColor;

void main() {

  // 由于v_normal进行了插值, 此时长度不为1
  vec3 norm = normalize(v_normal);

  // 漫反射
  vec3 lightDir = normalize(pointPos - v_pos); // 实际为: 入射光反方向
  float diff = max(dot(lightDir, norm), 0.0f); // cosθ值
  vec3 diffuse = pointColor * diff;

  // 镜面光照
  // 观察方向
  vec3 viewDir = normalize(viewPos - v_pos);
  // 计算反射向量
  // 第一个向量 要从光源指向片段位置的向量，但是lightDir当前正好相反[从片段指向光源]; 为了得到正确的reflect向量，对lightDir向量取反来获得相反的方向。
  vec3 reflectDir = reflect(-lightDir, norm);
  // 计算视线方向与反射方向的点乘（确保不是负值），然后取它的32次幂。这个32是高光的反光度(Shininess)。一个物体的反光度越高，反射光的能力越强，散射得越少，高光点就会越小。
  float spec = pow(max(dot(viewDir, reflectDir), 0.0f), 32.0f);
  vec3 specular = specularStren * spec * pointColor;

  // 环境光
  vec3 ambient = ambStren * pointColor;

  FragColor = vec4((ambient + diffuse + specular) * v_color.rgb, v_color.a);
}
