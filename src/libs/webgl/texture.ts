// export enum TextureType {
//   Diff, // 漫反射
//   Spec, // 镜面光
//   Refl, // 反射光
//   Ddn,
// }

export class Texture {
  private image = new Image();

  private texture!: WebGLTexture;

  private alpha!: boolean; // 纹理透明通道

  unit!: number; // 纹理单元

  // type!: TextureType; // 纹理类型

  constructor(private gl: WebGL2RenderingContext, unit = 0, alpha = false) {
    this.unit = unit;
    this.alpha = alpha;
  }

  async createTexture(url: string) {
    const { gl, image, alpha } = this;
    await this.loadImg(url);
    const texture = gl.createTexture(); // 创建纹理对象
    if (!texture) return;
    this.texture = texture;
    this.use(); // 激活与绑定

    // 当采样纹理的边缘时，OpenGL会对边缘的值和纹理下一个重复的值进行插值; 环绕方式设置为了GL_REPEAT, 这通常是没问题的.
    // 但由于使用了透明值，纹理图像的顶部将会与底部边缘的纯色值进行插值。这样的结果是一个半透明的有色边框、环绕着纹理的四边形。
    // 要想避免这个，每当使用alpha纹理时，将纹理的环绕方式设置为GL_CLAMP_TO_EDGE
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_WRAP_S,
      alpha ? gl.CLAMP_TO_EDGE : gl.REPEAT
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_WRAP_T,
      alpha ? gl.CLAMP_TO_EDGE : gl.REPEAT
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const format = alpha ? gl.RGBA : gl.RGB;
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      format,
      image.width,
      image.height,
      0,
      format,
      gl.UNSIGNED_BYTE,
      image
    );
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
    gl.activeTexture(gl[`TEXTURE${this.unit}` as "TEXTURE"]); // 激活纹理单元
    gl.bindTexture(gl.TEXTURE_2D, this.texture); // 将纹理对象与纹理单元绑定
  }
}
