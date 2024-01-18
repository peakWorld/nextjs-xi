#version 300 es
precision mediump float; // 必须设置精度

out vec4 FragColor;
in vec3 ourColor;
uniform float uColor;

void main()
{
  if (bool(uColor)) {
    FragColor = vec4(ourColor.r, ourColor.g * uColor, ourColor.b, 1.0);
  } else {
    FragColor = vec4(ourColor, 1.0);
  }
}