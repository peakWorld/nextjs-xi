"use client";

import { useEffect, useRef } from "react";
import { glMatrix, mat4, vec3 } from "gl-matrix";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize } from "@/app/(ex-3d)/_utils/w_/util";
import { set3DCubeRight, set3DCubeColors } from "@/app/(ex-3d)/_utils/w_/data-f";
import vs from "./vs.perspective.glsl";
import fs from "./fs.perspective.glsl";

const translation = [250, 250, 0];
const degree = [40, 25, 325];
const scale = [1, 1, 1];

export default function Case4_2() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gl = ref.current?.getContext("webgl2");
    if (!gl) return;

    // 在GPU上已经创建了一个GLSL程序
    const program = new Shader(gl, vs, fs).createProgram();
    if (!program) return;

    // 给GLSL程序提供数据
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // 收集属性的状态
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    {
      // 数据存放到缓存区<position>
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, set3DCubeRight(), gl.STATIC_DRAW);

      // 属性如何从缓冲区取出数据
      gl.enableVertexAttribArray(positionLocation);
      const size = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
    }

    {
      // 数据存放到缓存区<color>
      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, set3DCubeColors(), gl.STATIC_DRAW);

      // 属性如何从缓冲区取出数据
      gl.enableVertexAttribArray(colorLocation);
      const size = 3;
      const type = gl.UNSIGNED_BYTE;
      const normalize = true; // 数据归一化<0-255 to 0-1>
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
    }

    // 绘制图形
    function drawScene() {
      resizeCanvasToDisplaySize(ref.current as HTMLCanvasElement); // 调整画布大小
      if (!gl || !program) return;

      // 剔除背面三角形
      gl.enable(gl.CULL_FACE);
      // 开启深度测试
      gl.enable(gl.DEPTH_TEST);

      // 从裁剪空间转换到屏幕空间
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // 清空画布缓冲区
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 指定程序
      gl.useProgram(program);

      // 使用 属性状态集
      gl.bindVertexArray(vao);

      const matrix = mat4.create();
      // 透视投影
      const getPerspectiveMat = function (fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);
        return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (near + far) * rangeInv, -1, 0, 0, near * far * rangeInv * 2, 0];
      };
      //@ts-ignore
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      // @ts-ignore
      const projection = mat4.fromValues(...getPerspectiveMat(glMatrix.toRadian(60), aspect, 1, 2000));
      mat4.multiply(matrix, matrix, projection);

      // 设置矩阵变换 <位移>*<旋转>*<缩放> * position
      mat4.translate(matrix, matrix, vec3.fromValues(translation[0], translation[1], translation[2])); // 位移
      mat4.rotateX(matrix, matrix, glMatrix.toRadian(degree[0])); // 旋转X
      mat4.rotateY(matrix, matrix, glMatrix.toRadian(degree[1])); // 旋转Y
      mat4.rotateZ(matrix, matrix, glMatrix.toRadian(degree[2])); // 旋转Z
      mat4.scale(matrix, matrix, vec3.fromValues(scale[0], scale[1], scale[2])); // 缩放
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      // 绘制图形
      const offset = 0;
      const count = 16 * 6;
      gl.drawArrays(gl.TRIANGLES, offset, count);

      // requestAnimationFrame(drawScene);
    }

    drawScene();

    const gui = new GUI();
    gui.add(translation, 0, 0, 800).step(10).name("X").onChange(drawScene);
    gui.add(translation, 1, 0, 800).step(10).name("Y").onChange(drawScene);
    gui.add(translation, 2, 0, 800).step(10).name("Z").onChange(drawScene);
    gui.add(degree, 0, 0, 360).step(5).name("roateX").onChange(drawScene);
    gui.add(degree, 1, 0, 360).step(5).name("roateY").onChange(drawScene);
    gui.add(degree, 2, 0, 360).step(5).name("roateZ").onChange(drawScene);

    return () => {
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas className="w-full h-full" ref={ref} />;
}