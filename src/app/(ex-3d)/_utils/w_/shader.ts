export class Shader {
  private program!: WebGLProgram;

  constructor(private gl: WebGL2RenderingContext, private vsCode: string, private fsCode: string) {}

  /**
   * 创建顶点着色器
   */
  private createVShader(code: string) {
    const { gl } = this;
    const shader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log("shader(vs) compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  /**
   * 创建片段着色器
   */
  private createFShader(code: string) {
    const { gl } = this;
    const shader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log("shader(fs) compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  /**
   * 创建着色器程序
   */
  createProgram() {
    const { gl, vsCode, fsCode } = this;
    const vs = this.createVShader(vsCode);
    const fs = this.createFShader(fsCode);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      this.program = program;
      return program;
    }
    console.log("link program failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  /**
   * 使用着色器程序
   */
  use() {
    const { gl, program } = this;
    gl.useProgram(program);
  }
}
