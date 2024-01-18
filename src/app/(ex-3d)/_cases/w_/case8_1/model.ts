import Assimp from '@/components/w_/case8_1/assimp'
import { Texture, TextureType } from '@/core/texture'
import Mesh from './mesh'
import type { AssimpData, AMesh, Transformation, Material } from '@/interface/assimp'
import type { Webgl } from '@/core/webgl';
import type { Shader } from '@/core/shader';

export default class Model {
  private assimpData!: AssimpData

  private meshes: Mesh[] = []

  private files: string[] = [] // 模型文件路径

  private urls: string[] = [] // 纹理文件路径

  constructor(private w: Webgl, fileUrls: string[]) {
    // mtl|obj
    this.files = fileUrls.filter(it => /(mtl|obj)$/.test(it))
    // 纹理图片
    this.urls = fileUrls.filter(it => !/(mtl|obj)$/.test(it))
    this.setup()
  }

  private async setup() {
    const rsp = await Assimp.load(this.files)
    if (!rsp) return
    this.assimpData = rsp;
    this.processNode()
  }

  private processNode() {
    const { meshes, rootnode } = this.assimpData
    const { children: nodes } = rootnode
    if (!nodes.length) return
    nodes.forEach(node => {
      const { meshes: indexes, transformation } = node
      if (!indexes.length) return
      indexes.forEach((i) => this.processMesh(meshes[i], transformation))
    })
  }

  private async processMesh(mesh: AMesh, mat: Transformation) {
    const { materials } = this.assimpData
    const { vertices, normals, texturecoords, faces, materialindex, name } = mesh

    const vertexs = {
      Position: new Float32Array(vertices),
      Normal: new Float32Array(normals),
      // 一个顶点最多可以包含 8 个不同的纹理坐标。假设我们不会使用一个顶点具有多个纹理坐标的模型，因此始终使用第一个集合 (0)。
      TexCoords: new Float32Array(texturecoords[0]),
    }
    const indices = new Uint8Array(faces.reduce((total, it) => [...total, ...it], [] as number[]))
    const textures = await this.loadMaterialTextures(materials[materialindex])

    this.meshes.push(new Mesh(this.w.gl, vertexs, indices, textures, mat, name))
  }

  private async loadMaterialTextures(material: Material) {
    const { properties } = material
    const textures: Texture[] = []

    for (let i = 0, len = properties.length; i < len; i++) {
      const { type, semantic, value } = properties[i]
      // type 1 光照;
      // type 3 纹理
      // semantic 1 反射光(dif); 2 镜面光(spec); 3 (refl); 5 (D)

      // 只处理反射光纹理
      if (type !== 3) continue
      const url = this.urls.find(url => url.includes(value as string)) // 根据文件名字, 获取文件加载路径
      if (!url) continue
      if (semantic === 1) {
        const texture = await this.w.createTexture(url, 0, TextureType.Diff)
        textures.push(texture)
      }
      if (semantic === 2) {
        const texture = await this.w.createTexture(url, 1, TextureType.Spec)
        textures.push(texture)
      }
      if (semantic === 3) {
        const texture = await this.w.createTexture(url, 2, TextureType.Refl)
        textures.push(texture)
      }
      if (semantic === 5) {
        const texture = await this.w.createTexture(url, 3, TextureType.Ddn)
        textures.push(texture)
      }
    }
    return textures
  }

  draw(shader: Shader) {
    this.meshes.forEach(mesh => mesh.draw(shader))
  }
}
