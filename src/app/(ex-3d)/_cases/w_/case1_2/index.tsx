"use client";

import { useEffect, useRef } from "react";
import { mat3, vec2 } from "gl-matrix";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize } from "@/app/(ex-3d)/_utils/w_/util";
import vs from "./vs.glsl";
import fs from "./fs.glsl";

var positions = [-150, -100, 150, -100, -150, 100, 150, -100, -150, 100, 150, 100]; // 坐标数据<像素xy>
var colors = (() => {
  // 颜色数据<rgba>

  // 每个三角形的三个顶点颜色一样
  // var r1 = Math.random();
  // var b1 = Math.random();
  // var g1 = Math.random();
  // var r2 = Math.random();
  // var b2 = Math.random();
  // var g2 = Math.random();
  // return [r1, b1, g1, 1, r1, b1, g1, 1, r1, b1, g1, 1, r2, b2, g2, 1, r2, b2, g2, 1, r2, b2, g2, 1];

  // 每个三角形的三个顶点颜色不一样
  return [
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
  ];
})();

export default function Case1_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gl = ref.current?.getContext("webgl2");
    if (!gl) return;

    // 1. 在GPU上已经创建了一个GLSL程序
    const program = new Shader(gl, vs, fs).createProgram();
    if (!program) return;

    // 2. 给GLSL程序提供数据
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // 2.1 收集属性的状态
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // 2.2.1 数据存放到缓存区<position>
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 2.2.2 属性如何从缓冲区取出数据
    gl.enableVertexAttribArray(positionAttributeLocation);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // 2.3 <color>
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(colorLocation);
    var size = 4;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

    // 3. 绘制图形
    function drawScene() {
      resizeCanvasToDisplaySize(ref.current as HTMLCanvasElement); // 调整画布大小
      if (!gl || !program) return;

      // 3.1 从裁剪空间转换到屏幕空间
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      // 注: 如果未设置gl.viewport, 则相当于默认执行gl.viewport(0, 0, 300, 150); 且300/150是canvas的默认宽高

      // 3.2 清空画布缓冲区
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 3.3 指定程序
      gl.useProgram(program);

      // 3.4 使用 属性状态集
      gl.bindVertexArray(vao);

      // 3.5 设置矩阵<全局变量>
      var matrix = mat3.create();
      mat3.projection(matrix, ref.current!.clientWidth, ref.current!.clientHeight); // 具有给定边界的2D投影矩阵
      mat3.translate(matrix, matrix, vec2.fromValues(200, 150)); // 位移<像素>
      mat3.rotate(matrix, matrix, 0); // 旋转
      mat3.scale(matrix, matrix, vec2.fromValues(1, 1)); // 缩放
      gl.uniformMatrix3fv(matrixLocation, false, matrix);

      // 3.6 绘制图形
      var offset = 0;
      var count = 6;
      gl.drawArrays(gl.TRIANGLES, offset, count);
    }

    drawScene();

    return () => {
      // 开发中的热更新会复用canvas, 那么gl也会复用; 此处丢弃gl上下文, 那么热更新后就丢失上下文
      // const loseContextExt = gl.getExtension("WEBGL_lose_context");
      // loseContextExt?.loseContext();
    };
  }, []);

  return <canvas ref={ref} />;
}
