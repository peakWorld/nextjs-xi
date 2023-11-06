export enum TextureType {
  Diff, // 漫反射
  Spec, // 镜面光
  Refl, // 反射光
  Ddn,
}

export class Texture {
  private image = new Image();

  private texture!: WebGLTexture;

  unit!: number; // 纹理单元

  type!: TextureType; // 纹理类型

  constructor(private gl: WebGL2RenderingContext, unit = 0, type = 0) {
    this.unit = unit;
    this.type = type;
  }

  async createTexture(url: string) {
    const { gl, image } = this;
    await this.loadImg(url);
    const texture = gl.createTexture(); // 创建纹理对象
    if (!texture) return;
    this.texture = texture;
    this.use(); // 激活与绑定

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D); // 开启多级渐远纹理级别


    // 图片坐标系(自身): 左上为原点, 向右为x轴正方向、向下为y轴正方向
    // 纹理坐标系: 左下为原点, 向右为x轴正方向、向下y轴正方向
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // y轴反转
  }

  private loadImg(url: string) {
    const { image } = this;
    image.src = url;
    return new Promise((resolve) => {
      image.onload = resolve;
    });
  }

  use() {
    const { gl } = this;
    gl.activeTexture(gl[`TEXTURE${this.unit}` as 'TEXTURE']); // 激活纹理单元
    gl.bindTexture(gl.TEXTURE_2D, this.texture); // 将纹理对象与纹理单元绑定
  }
}
