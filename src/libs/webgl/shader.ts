import type { mat4, mat3, mat2 } from "gl-matrix";
import { isArray, isNumber } from "@/utils/type";

type Mat = mat4 | mat3 | mat2;

export class Shader {
  private program!: WebGLProgram;

  constructor(private gl: WebGL2RenderingContext) {}

  /**
   * 创建顶点着色器
   */
  private createVShader(code: string) {
    const { gl } = this;
    const shader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log("shader(vs) compile failed:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  /**
   * 创建片段着色器
   */
  private createFShader(code: string) {
    const { gl } = this;
    const shader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log("shader(fs) compile failed:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  /**
   * 创建着色器程序
   */
  createProgram(vsCode: string, fsCode: string) {
    const { gl } = this;
    const vs = this.createVShader(vsCode);
    const fs = this.createFShader(fsCode);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log("link program failed:", gl.getProgramInfoLog(program));
      return;
    }
    this.program = program;
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  }

  /**
   * 使用着色器程序
   */
  use() {
    const { gl, program } = this;
    gl.useProgram(program);
  }

  /** uniform 参数设置 */

  setNumber(name: string, value: number | number[], isInt = false) {
    const { gl, program } = this;
    const local = gl.getUniformLocation(program, name);
    if (isArray(value) && value.length) {
      const floors = value
        .slice(0, 4)
        .map((it) => (isInt ? Math.floor(it) : it)) as Tuple<number>;
      const len = floors.length;
      const key = isInt
        ? (`uniform${len}i` as "uniform4i")
        : (`uniform${len}f` as "uniform4f");
      gl[key](local, ...floors);
    } else if (isNumber(value)) {
      const key = isInt ? "uniform1i" : "uniform1f";
      gl[key](local, isInt ? Math.floor(value) : value);
    }
  }

  setInt(name: string, value: number | number[]) {
    this.setNumber(name, value, true);
  }

  setFloat(name: string, value: number | number[]) {
    this.setNumber(name, value);
  }

  setMat(name: string, value: Mat) {
    const { gl, program } = this;
    const key = `uniformMatrix${Math.floor(
      value.length / 4
    )}fv` as "uniformMatrix4fv";
    gl[key](gl.getUniformLocation(program, name), false, value);
  }

  getAttrib(name: string) {
    const { gl, program } = this;
    return gl.getAttribLocation(program, name);
  }

  setAttribV(unit: number, value: number[]) {
    const { gl } = this;
    const key = `vertexAttrib${value.length}fv` as "vertexAttrib4fv";
    gl[key](unit, value);
  }
}
