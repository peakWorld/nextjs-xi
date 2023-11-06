import type { Shader } from '@/core/shader'
import type { Transformation } from '@/interface/assimp'
import type { Texture } from '@/core/texture'
import { TextureType } from '@/core/texture'

export interface Vertexs {
  Position: Float32Array
  Normal: Float32Array
  TexCoords: Float32Array
}

export default class Mesh {
  private VAO!: WebGLVertexArrayObject /* 顶点数组对象 */

  vertexs!: Vertexs /* 一系列的顶点 */
  indices!: Uint8Array  /* 用于索引绘制的索引 */
  textures!: Texture[] /* 纹理形式的材质数据 */
  transform!: Transformation /* 模型矩阵(在世界坐标中的位置) */
  name!: string /* 名称 */

  constructor(private gl: WebGL2RenderingContext, vertexs: Vertexs, indices: Uint8Array, textures: Texture[], transform: Transformation, name: string) {
    this.vertexs = vertexs
    this.indices = indices
    this.textures = textures
    this.transform = transform;
    this.name = name;

    this.setupMesh()
  }

  draw(shader: Shader) {
    const { textures, gl } = this

    textures.forEach((texture) => {
      const { type, unit } = texture
      let name = ''
      if (type === TextureType.Diff) {
        name = 'diffuse'
      }
      if (type === TextureType.Spec) {
        name = 'specular'
      }
      if (type === TextureType.Refl) {
        name = 'reflection'
      }
      if (type === TextureType.Ddn) {
        name = 'ddnt'
      }
      texture.use()
      shader.setInt(name, unit)
    })

    gl.bindVertexArray(this.VAO)
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
  }

  setupMesh() {
    const { gl, vertexs, indices } = this
    const P_Z = vertexs.Position.BYTES_PER_ELEMENT

    const vao = gl.createVertexArray()
    if (!vao) return

    gl.bindVertexArray(vao)

    const vb_pos = gl.createBuffer(); // 缓冲对象(顶点)
    gl.bindBuffer(gl.ARRAY_BUFFER, vb_pos);
    gl.bufferData(gl.ARRAY_BUFFER, vertexs.Position, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * P_Z, 0);
    gl.enableVertexAttribArray(0);

    const vb_normal = gl.createBuffer(); // 缓冲对象(法向量)
    gl.bindBuffer(gl.ARRAY_BUFFER, vb_normal);
    gl.bufferData(gl.ARRAY_BUFFER, vertexs.Normal, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 3 * P_Z, 0);
    gl.enableVertexAttribArray(1);

    const vb_coord = gl.createBuffer(); // 缓冲对象(纹理)
    gl.bindBuffer(gl.ARRAY_BUFFER, vb_coord);
    gl.bufferData(gl.ARRAY_BUFFER, vertexs.TexCoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 2 * P_Z, 0);
    gl.enableVertexAttribArray(2);

    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    this.VAO = vao
  }
}
