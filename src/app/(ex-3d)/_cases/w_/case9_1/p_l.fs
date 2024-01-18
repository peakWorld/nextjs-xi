#version 300 es
precision mediump float;// 必须设置精度

uniform sampler2D texture1;
in vec2 v_coord;
out vec4 FragColor;

float near = 0.1f;
float far = 100.0f;

float LinearizeDepth(float depth) {
  float z = depth * 2.0f - 1.0f; // back to NDC
  return (2.0f * near * far) / (far + near - z * (far - near));
}

void main() {
  FragColor = texture(texture1, v_coord);

  // 物体全白？
  // z值很小的时候有很高的精度，而z值很大的时候有较低的精度。
  // 片段的深度值会随着距离迅速增加，所以几乎所有的顶点的深度值都是接近于1.0的。
  // FragColor = vec4(vec3(gl_FragCoord.z), 1.0f);

  // 将屏幕空间中非线性的深度值变换至线性深度值
  // 线性化的深度值处于near与far之间，它的大部分值都会大于1.0并显示为完全的白色。
  // 通过将线性深度值除以far，近似地将线性深度值转化到[0, 1]的范围之间。
  // float depth = LinearizeDepth(gl_FragCoord.z) / far;
  // FragColor = vec4(vec3(depth), 1.0f);
}
