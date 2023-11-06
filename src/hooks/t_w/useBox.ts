"use client";

import { useCallback } from "react";
import { Webgl } from "@/libs/webgl";
// Create a cube
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |     | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3

const vertices = new Float32Array([
  // Vertex coordinates
  1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0, // v0-v1-v2-v3 front
  1.0,
  1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  1.0,
  -1.0, // v0-v3-v4-v5 right
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  1.0, // v0-v5-v6-v1 up
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  1.0, // v1-v6-v7-v2 left
  -1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0, // v7-v4-v3-v2 down
  1.0,
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  -1.0, // v4-v7-v6-v5 back
]);

const colors = new Float32Array([
  // Colors
  0.4,
  0.4,
  1.0,
  0.4,
  0.4,
  1.0,
  0.4,
  0.4,
  1.0,
  0.4,
  0.4,
  1.0, // v0-v1-v2-v3 front(blue)
  0.4,
  1.0,
  0.4,
  0.4,
  1.0,
  0.4,
  0.4,
  1.0,
  0.4,
  0.4,
  1.0,
  0.4, // v0-v3-v4-v5 right(green)
  1.0,
  0.4,
  0.4,
  1.0,
  0.4,
  0.4,
  1.0,
  0.4,
  0.4,
  1.0,
  0.4,
  0.4, // v0-v5-v6-v1 up(red)
  1.0,
  1.0,
  0.4,
  1.0,
  1.0,
  0.4,
  1.0,
  1.0,
  0.4,
  1.0,
  1.0,
  0.4, // v1-v6-v7-v2 left
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0, // v7-v4-v3-v2 down
  0.4,
  1.0,
  1.0,
  0.4,
  1.0,
  1.0,
  0.4,
  1.0,
  1.0,
  0.4,
  1.0,
  1.0, // v4-v7-v6-v5 back
]);

const indices = new Uint8Array([
  // Indices of the vertices
  0,
  1,
  2,
  0,
  2,
  3, // front
  4,
  5,
  6,
  4,
  6,
  7, // right
  8,
  9,
  10,
  8,
  10,
  11, // up
  12,
  13,
  14,
  12,
  14,
  15, // left
  16,
  17,
  18,
  16,
  18,
  19, // down
  20,
  21,
  22,
  20,
  22,
  23, // back
]);

const normals = new Float32Array([
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0, // v0-v1-v2-v3 front
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0, // v0-v3-v4-v5 right
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0, // v0-v5-v6-v1 up
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0, // v1-v6-v7-v2 left
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0, // v7-v4-v3-v2 down
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0, // v4-v7-v6-v5 back
]);

const P_Z = vertices.BYTES_PER_ELEMENT;

export default function useBox(useNormal = false, useVao = true) {
  const box = useCallback((w: Webgl) => {
    const { gl } = w;
    let vao = null;

    // 是否使用顶点数组对象
    if (useVao) {
      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
    }

    const vbo = gl.createBuffer(); // 缓冲对象(顶点)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * P_Z, 0);
    gl.enableVertexAttribArray(0);

    const vboColor = gl.createBuffer(); // 缓冲对象(颜色)
    gl.bindBuffer(gl.ARRAY_BUFFER, vboColor);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 3 * P_Z, 0);
    gl.enableVertexAttribArray(1);

    if (useNormal) {
      const vboNormal = gl.createBuffer(); // 缓冲对象(法向量)
      gl.bindBuffer(gl.ARRAY_BUFFER, vboNormal);
      gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
      gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 3 * P_Z, 0);
      gl.enableVertexAttribArray(2);
    }

    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return { vao, pointNum: indices.length, vbo, vboColor, ebo, indices, P_Z };
  }, []);

  return box;
}
