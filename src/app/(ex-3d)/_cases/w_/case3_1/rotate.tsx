"use client";

import { useEffect, useRef } from "react";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize } from "@/app/(ex-3d)/_utils/w_/util";
import { set2DF } from "@/app/(ex-3d)/_utils/w_/data-f";
import vs from "./vs.rotate.glsl";
import fs from "./fs.glsl";

var color = [Math.random(), Math.random(), Math.random(), 1];
var translation = [250, 250];
var angleInRadians = (30 * Math.PI) / 180;
var rotation = [Math.sin(angleInRadians), Math.cos(angleInRadians)];
var scale = [0.5, 0.5];

export default function Case3_1() {
  const ref = useRef<HTMLCanvasElement>(null);

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
    var translationLocation = gl.getUniformLocation(program, "u_translation");
    var rotationLocation = gl.getUniformLocation(program, "u_rotation");
    var scaleLocation = gl.getUniformLocation(program, "u_scale");

    // 2.1 收集属性的状态
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // 2.2.1 数据存放到缓存区<position>
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, set2DF(0, 0), gl.STATIC_DRAW);

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
      gl.uniform4fv(colorLocation, color);
      gl.uniform2fv(translationLocation, translation); // 设置平移
      gl.uniform2fv(rotationLocation, rotation); // 设置旋转
      gl.uniform2fv(scaleLocation, scale); // 设置缩放

      // 3.6 绘制图形
      var offset = 0;
      var count = 18;
      gl.drawArrays(gl.TRIANGLES, offset, count);

      // requestAnimationFrame(drawScene);
    }

    drawScene();
  }, []);

  return <canvas className="w-full h-full" ref={ref} />;
}
