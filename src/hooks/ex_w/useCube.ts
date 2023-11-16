"use client";

import { useCallback } from "react";
import { Webgl } from "@/libs/webgl";

// positions // texture Coords
const cubeVert = new Float32Array([
  -0.5, -0.5, -0.5, 0.0, 0.0, 0.5, -0.5, -0.5, 1.0, 0.0, 0.5, 0.5, -0.5, 1.0,
  1.0, 0.5, 0.5, -0.5, 1.0, 1.0, -0.5, 0.5, -0.5, 0.0, 1.0, -0.5, -0.5, -0.5,
  0.0, 0.0,

  -0.5, -0.5, 0.5, 0.0, 0.0, 0.5, -0.5, 0.5, 1.0, 0.0, 0.5, 0.5, 0.5, 1.0, 1.0,
  0.5, 0.5, 0.5, 1.0, 1.0, -0.5, 0.5, 0.5, 0.0, 1.0, -0.5, -0.5, 0.5, 0.0, 0.0,

  -0.5, 0.5, 0.5, 1.0, 0.0, -0.5, 0.5, -0.5, 1.0, 1.0, -0.5, -0.5, -0.5, 0.0,
  1.0, -0.5, -0.5, -0.5, 0.0, 1.0, -0.5, -0.5, 0.5, 0.0, 0.0, -0.5, 0.5, 0.5,
  1.0, 0.0,

  0.5, 0.5, 0.5, 1.0, 0.0, 0.5, 0.5, -0.5, 1.0, 1.0, 0.5, -0.5, -0.5, 0.0, 1.0,
  0.5, -0.5, -0.5, 0.0, 1.0, 0.5, -0.5, 0.5, 0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0,

  -0.5, -0.5, -0.5, 0.0, 1.0, 0.5, -0.5, -0.5, 1.0, 1.0, 0.5, -0.5, 0.5, 1.0,
  0.0, 0.5, -0.5, 0.5, 1.0, 0.0, -0.5, -0.5, 0.5, 0.0, 0.0, -0.5, -0.5, -0.5,
  0.0, 1.0,

  -0.5, 0.5, -0.5, 0.0, 1.0, 0.5, 0.5, -0.5, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 0.0,
  0.5, 0.5, 0.5, 1.0, 0.0, -0.5, 0.5, 0.5, 0.0, 0.0, -0.5, 0.5, -0.5, 0.0, 1.0,
]);

const planeVert = new Float32Array([
  5.0, -0.5, 5.0, 2.0, 0.0, -5.0, -0.5, 5.0, 0.0, 0.0, -5.0, -0.5, -5.0, 0.0,
  2.0,

  5.0, -0.5, 5.0, 2.0, 0.0, -5.0, -0.5, -5.0, 0.0, 2.0, 5.0, -0.5, -5.0, 2.0,
  2.0,
]);

const faceVert = new Float32Array([
  // 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -0.5, 0.0, 0.0, 1.0, 1.0, -0.5, 0.0, 1.0, 1.0,
  // 0.0, 0.5, 0.0, 0.0, 0.0, 1.0, -0.5, 0.0, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0, 0.0,
  // 更换纹理坐标的方位, 解决纹理倒置的问题
  0.0,
  0.5, 0.0, 0.0, 1.0, 0.0, -0.5, 0.0, 0.0, 0.0, 1.0, -0.5, 0.0, 1.0, 0.0, 0.0,
  0.5, 0.0, 0.0, 1.0, 1.0, -0.5, 0.0, 1.0, 0.0, 1.0, 0.5, 0.0, 1.0, 1.0,
]);

const P_Z = cubeVert.BYTES_PER_ELEMENT;

export default function useCube() {
  return useCallback((w: Webgl) => {
    const { gl } = w;
    const cube = gl.createVertexArray();
    gl.bindVertexArray(cube);
    const vbo_c = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_c);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVert, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * P_Z, 0); // 缓冲对象(顶点)
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 5 * P_Z, 3 * P_Z); // 缓冲对象(纹理)
    gl.enableVertexAttribArray(2);

    const plane = gl.createVertexArray();
    gl.bindVertexArray(plane);
    const vbo_p = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_p);
    gl.bufferData(gl.ARRAY_BUFFER, planeVert, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * P_Z, 0); // 缓冲对象(顶点)
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 5 * P_Z, 3 * P_Z); // 缓冲对象(纹理)
    gl.enableVertexAttribArray(2);

    const face = gl.createVertexArray();
    gl.bindVertexArray(face);
    const vbo_f = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_f);
    gl.bufferData(gl.ARRAY_BUFFER, faceVert, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * P_Z, 0); // 缓冲对象(顶点)
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 5 * P_Z, 3 * P_Z); // 缓冲对象(纹理)
    gl.enableVertexAttribArray(2);

    return {
      cube: { size: 36, vao: cube },
      plane: { size: 6, vao: plane },
      face: { size: 6, vao: face },
      P_Z,
    };
  }, []);
}
