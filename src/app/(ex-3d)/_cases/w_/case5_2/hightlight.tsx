"use client";

import { useEffect, useRef } from "react";
import { glMatrix, mat4, vec3 } from "gl-matrix";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize } from "@/app/(ex-3d)/_utils/w_/util";
import { set3DCubeRight, set3DCubeNormals } from "@/app/(ex-3d)/_utils/w_/data-f";
import vs from "./vs.hightlight.glsl";
import fs from "./fs.hightlight.glsl";

function transformVector(m: mat4, v: number[]) {
  const dst = [];
  for (let i = 0; i < 4; ++i) {
    // 行
    dst[i] = 0.0;
    for (let j = 0; j < 4; ++j) {
      // 列
      dst[i] += v[j] * m[j * 4 + i];
    }
  }
  return dst;
}

const Radians = [0];
const shininess = [32];

export default function Case5_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gl = ref.current?.getContext("webgl2");
    if (!gl) return;

    // 1. 在GPU上已经创建了一个GLSL程序
    const program = new Shader(gl, vs, fs).createProgram();
    if (!program) return;

    // 2. 给GLSL程序提供数据
    const positionLocation = gl.getAttribLocation(program, "a_position"); // 顶点位置
    const normalLocation = gl.getAttribLocation(program, "a_normal"); // 顶点法向量
    const mvpLocation = gl.getUniformLocation(program, "u_worldViewProjection"); // 变化矩阵
    const worldLocation = gl.getUniformLocation(program, "u_world"); // 模型矩阵<世界矩阵>
    const inverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose"); // 模型矩阵<世界矩阵>的逆转值矩阵
    const colorLocation = gl.getUniformLocation(program, "u_color"); // 物体颜色
    const viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition"); // 相机位置<观察者>

    const lightWorldPositionLocation = gl.getUniformLocation(program, "u_lightWorldPosition"); // 光源位置
    const shininessLocation = gl.getUniformLocation(program, "u_shininess");

    // 2.1 收集属性的状态
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    {
      // 将F移动到 坐标系原点处
      const positions = set3DCubeRight();
      const matrix = mat4.create();
      mat4.rotateX(matrix, matrix, Math.PI);
      mat4.translate(matrix, matrix, vec3.fromValues(-50, -75, -15));

      for (let ii = 0; ii < positions.length; ii += 3) {
        const vector = transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
        positions[ii + 0] = vector[0];
        positions[ii + 1] = vector[1];
        positions[ii + 2] = vector[2];
      }

      // 2.2.1 数据存放到缓存区<position>
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      // 2.2.2 属性如何从缓冲区取出数据
      gl.enableVertexAttribArray(positionLocation);
      const size = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
    }

    {
      // 2.3.1 数据存放到缓存区<color>
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, set3DCubeNormals(), gl.STATIC_DRAW);

      // 2.3.2 属性如何从缓冲区取出数据
      gl.enableVertexAttribArray(normalLocation);
      const size = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);
    }

    // 3. 绘制图形
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

      // 矩阵变换
      const matrix = mat4.create();

      // 投影矩阵
      const radians = glMatrix.toRadian(60);
      const aspect = ref.current!.clientWidth / ref.current!.clientHeight;
      const zNear = 1;
      const zFar = 2000;
      const projection = mat4.perspectiveNO(mat4.create(), radians, aspect, zNear, zFar); // 投影矩阵

      // 视图矩阵
      var camera = [100, 150, 200];
      var target = vec3.fromValues(0, 35, 0);
      var up = vec3.fromValues(0, 1, 0);
      const viewMatrix = mat4.lookAt(mat4.create(), vec3.fromValues(camera[0], camera[1], camera[2]), target, up);
      mat4.multiply(matrix, projection, viewMatrix);

      // 模型矩阵
      const worldMat = mat4.create();
      mat4.rotateY(worldMat, worldMat, glMatrix.toRadian(Radians[0]));
      mat4.multiply(matrix, matrix, worldMat);

      // 模型矩阵的逆转置矩阵
      const worldMatInverseTranspose = mat4.create();
      mat4.invert(worldMatInverseTranspose, worldMat);
      mat4.transpose(worldMatInverseTranspose, worldMatInverseTranspose);

      // 设置全局变量
      gl.uniformMatrix4fv(mvpLocation, false, matrix);
      gl.uniformMatrix4fv(worldLocation, false, worldMat); // 模型矩阵
      gl.uniformMatrix4fv(inverseTransposeLocation, false, worldMatInverseTranspose); // 模型矩阵的逆转值矩阵
      gl.uniform3fv(viewWorldPositionLocation, camera); // 设置相机位置<观察者>

      gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // 设置物体颜色
      gl.uniform3fv(lightWorldPositionLocation, [20, 30, 60]); // 设置光源位置
      gl.uniform1f(shininessLocation, shininess[0]);

      // 绘制图形
      const primitiveType = gl.TRIANGLES;
      const offset = 0;
      const count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);

      // requestAnimationFrame(drawScene);
    }

    drawScene();

    const gui = new GUI();
    gui.add(Radians, 0, -180, 180).step(10).name("RadiansY").onChange(drawScene);
    gui.add(shininess, 0, 8, 128).step(4).name("Shininess").onChange(drawScene);

    return () => {
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas className="w-full h-full" ref={ref} />;
}
