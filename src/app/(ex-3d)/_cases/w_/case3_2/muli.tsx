"use client";

import { useEffect, useRef } from "react";
import { glMatrix, mat3, vec2 } from "gl-matrix";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize } from "@/app/(ex-3d)/_utils/w_/util";
import vs from "./vs.glsl";
import fs from "./fs.glsl";

var translation = [60, 40];
var degree = { value: 10 };
var scale = [0.85, 0.85];

export default function Case3_2() {
  const ref = useRef<HTMLCanvasElement>(null);
  // 构成 'F'
  function setGeometry(gl: WebGL2RenderingContext, x: number, y: number) {
    var width = 100;
    var height = 150;
    var thickness = 30;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // 左竖
        x,
        y,
        x + thickness,
        y,
        x,
        y + height,
        x,
        y + height,
        x + thickness,
        y,
        x + thickness,
        y + height,

        // 上横
        x + thickness,
        y,
        x + width,
        y,
        x + thickness,
        y + thickness,
        x + thickness,
        y + thickness,
        x + width,
        y,
        x + width,
        y + thickness,

        // 中横
        x + thickness,
        y + thickness * 2,
        x + (width * 2) / 3,
        y + thickness * 2,
        x + thickness,
        y + thickness * 3,
        x + thickness,
        y + thickness * 3,
        x + (width * 2) / 3,
        y + thickness * 2,
        x + (width * 2) / 3,
        y + thickness * 3,
      ]),
      gl.STATIC_DRAW
    );
  }

  useEffect(() => {
    const gl = ref.current?.getContext("webgl2");
    if (!gl) return;

    // 1. 在GPU上已经创建了一个GLSL程序
    const program = new Shader(gl, vs, fs).createProgram();
    if (!program) return;

    // 2. 给GLSL程序提供数据
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // 2.1 收集属性的状态
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // 2.2.1 数据存放到缓存区<position>
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    setGeometry(gl, 0, 0);

    // 2.2.2 属性如何从缓冲区取出数据
    gl.enableVertexAttribArray(positionLocation);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    // 3. 绘制图形
    function drawScene() {
      resizeCanvasToDisplaySize(ref.current as HTMLCanvasElement); // 调整画布大小
      if (!gl || !program) return;

      // 3.1 从裁剪空间转换到屏幕空间
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // 3.2 清空画布缓冲区
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 3.3 指定程序
      gl.useProgram(program);

      // 3.4 使用 属性状态集
      gl.bindVertexArray(vao);

      // 3.5 设置全局变量
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

      // 3.6 设置矩阵变换 <位移>*<旋转>*<缩放> * position

      const translationMatrix = mat3.fromTranslation(mat3.create(), vec2.fromValues(translation[0], translation[1])); // 位移
      const rotationMatrix = mat3.fromRotation(mat3.create(), glMatrix.toRadian(degree.value)); // 旋转
      const scaleMatrix = mat3.fromScaling(mat3.create(), vec2.fromValues(scale[0], scale[1])); // 缩放

      // 初始矩阵
      var matrix = mat3.create();

      // 每个'F'都以前一个的矩阵为基础
      // 每个'F'都是绕着它的左上角<原点(0, 0)>旋转<度数为正, 则顺时针>。
      for (var i = 0; i < 5; ++i) {
        // 矩阵相乘
        matrix = mat3.multiply(matrix, matrix, translationMatrix);
        matrix = mat3.multiply(matrix, matrix, rotationMatrix);
        matrix = mat3.multiply(matrix, matrix, scaleMatrix);
        gl.uniformMatrix3fv(matrixLocation, false, matrix);
        gl.uniform4fv(colorLocation, [Math.random(), Math.random(), Math.random(), 1]);

        // 绘制图形
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 18;
        gl.drawArrays(primitiveType, offset, count);
      }

      // requestAnimationFrame(drawScene);
    }

    drawScene();

    const gui = new GUI();
    gui.add(translation, 0, 0, 800).name("x").onChange(drawScene);
    gui.add(translation, 1, 0, 800).name("y").onChange(drawScene);
    gui.add(degree, "value", 0, 360).name("degree").step(10).onChange(drawScene);
    gui.add(scale, 0, -5, 5).name("scaleX").onChange(drawScene);
    gui.add(scale, 1, -5, 5).name("scaleY").onChange(drawScene);

    return () => {
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas className="w-full h-full" ref={ref} />;
}
