* 着色器中可以获取纹理大小
在WebGL1中，如果着色器需要知道纹理的大小，需要手动用uniform传递纹理大小。
在WebGL2中, 可以调用 `vec2 size = textureSize(sampler, lod)`

* 直接选取纹素 在纹理中很方便存储大量数组数据。
在WebGL1中 得用纹理坐标(0.0 到 1.0)来寻址。
在WebGL2中 可以在纹理中直接用**像素／纹素坐标**来选取值
`vec4 values = texelFetch(sampler, ivec2Position, lod);`

* 纹理数组 每个切片都是单独的纹理,所有切片都必须是相同的大小。
`vec4 color = texture(someSampler2DArray, vec3(u, v, slice));`

* 非2的幂纹理支持
WebGL1中不是2的幂的纹理不能有mip。
WebGL2移除了限制，非2的幂大小的纹理和2的幂大小的纹理一样工作。

* GLSL中的矩阵函数
WebGL1中，如果需要获得矩阵的逆，需要将它作为uniform传给着色器。
WebGL2 GLSL 300 es 里有内置的inverse函数，同样有转置函数transpose。

[链接](https://webgl2fundamentals.org/webgl/lessons/zh_cn/webgl2-whats-new.html)
