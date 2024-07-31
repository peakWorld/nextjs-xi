"use client";

import { useEffect, useRef } from "react";
import { glMatrix, mat4, vec3 } from "gl-matrix";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize } from "@/app/(ex-3d)/_utils/w_/util";
import { set3DCubeRight, set3DCubeColors } from "@/app/(ex-3d)/_utils/w_/data-f";
import vs from "./vs.glsl";
import fs from "./fs.glsl";

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

const cameraAngleRadians = [0];

export default function Case4_3() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gl = ref.current?.getContext("webgl2");
    if (!gl) return;

    // 1. 在GPU上已经创建了一个GLSL程序
    const program = new Shader(gl, vs, fs).createProgram();
    if (!program) return;

    // 2. 给GLSL程序提供数据
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");

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
      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, set3DCubeColors(), gl.STATIC_DRAW);

      // 2.3.2 属性如何从缓冲区取出数据
      gl.enableVertexAttribArray(colorLocation);
      const size = 3;
      const type = gl.UNSIGNED_BYTE;
      const normalize = true; // 数据归一化<0-255 to 0-1>
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
    }

    // 3. 绘制图形
    function drawScene() {
      resizeCanvasToDisplaySize(ref.current as HTMLCanvasElement); // 调整画布大小
      if (!gl || !program) return;

      const numFs = 5;
      const radius = 200;

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

      const radians = glMatrix.toRadian(60);
      const aspect = ref.current!.clientWidth / ref.current!.clientHeight;
      const zNear = 1;
      const zFar = 2000;
      const projection = mat4.perspectiveNO(mat4.create(), radians, aspect, zNear, zFar); // 投影矩阵

      // 相机矩阵
      let cameraMatrix = mat4.create();
      mat4.fromYRotation(cameraMatrix, glMatrix.toRadian(cameraAngleRadians[0]));
      mat4.translate(cameraMatrix, cameraMatrix, vec3.fromValues(0, 50, radius * 2));

      // lookAt
      const up = vec3.fromValues(0, 1, 0);
      const fPosition = vec3.fromValues(radius, 0, 0);
      const cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]; // 相机坐标
      //@ts-ignore <某个位置看向某处, 非视图矩阵>
      cameraMatrix = mat4.targetTo(mat4.create(), vec3.fromValues(...cameraPosition), fPosition, up);

      // 视图矩阵(相机矩阵的逆矩阵)
      const viewMatrix = mat4.invert(mat4.create(), cameraMatrix);
      mat4.multiply(matrix, projection, viewMatrix); // 视图投影矩阵

      for (let ii = 0; ii < numFs; ++ii) {
        const angle = (ii * Math.PI * 2) / numFs;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const worldMat = mat4.create();
        mat4.translate(worldMat, matrix, vec3.fromValues(x, 0, z));
        gl.uniformMatrix4fv(matrixLocation, false, worldMat);

        // 绘制图形
        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        const count = 16 * 6;
        gl.drawArrays(primitiveType, offset, count);
      }

      // requestAnimationFrame(drawScene);
    }

    drawScene();

    const gui = new GUI();
    gui.add(cameraAngleRadians, 0, -360, 360).step(10).name("cameraAngleRadians").onChange(drawScene);

    return () => {
      document.querySelector(".lil-gui")?.remove();
    };
  }, []);

  return <canvas className="w-full h-full" ref={ref} />;
}
