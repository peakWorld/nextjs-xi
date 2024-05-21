"use client";

import { useEffect, useRef } from "react";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize } from "@/app/(ex-3d)/_utils/w_/util";
import vs from "./vs.pixel.glsl";
import fs from "./fs.pixel.glsl";

var positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]; // 顶点数据<像素坐标>

export default function Case1_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gl = ref.current?.getContext("webgl2");
    if (!gl) return;
    resizeCanvasToDisplaySize(ref.current as HTMLCanvasElement);

    // 1. 在GPU上已经创建了一个GLSL程序
    const program = new Shader(gl, vs, fs).createProgram();
    if (!program) return;

    // 2. 给GLSL程序提供数据
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution"); // 全局变量

    // 2.1 数据存放到缓存区
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 2.2 告诉属性如何从缓冲区取出数据
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // 3. 从裁剪空间转换到屏幕空间<将裁剪空间的-1~+1映射到x轴0~width和y轴0~height>
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 4. 清空画布颜色
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 5. 运行着色器程序
    gl.useProgram(program);

    // 6. 告诉程序 用哪个缓冲区和如何从缓冲区取出数据给到属性
    gl.bindVertexArray(vao);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height); // 设置uniform的值

    // 7. 绘制图形
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count); // 调用顶点着色器6次<2个三角形>
  }, []);

  return <canvas className="w-full h-full" ref={ref} />;
}
