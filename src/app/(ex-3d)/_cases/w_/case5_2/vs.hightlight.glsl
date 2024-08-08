#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;
uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  // 在物体变化时, 重定向法向量<忽略 位移; 只考虑旋转、缩放>
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  // 计算表面的世界坐标
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  // 计算表面到光源的方向
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  // 计算表面到相机的方向
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
