"use client";

import { useCallback } from "react";
import { Webgl } from "@/libs/webgl";

const vertices = new Float32Array([
  // 右上
  0.5, 0.5, 0, 2.0, 2.0,
  // 右下
  0.5, -0.5, 0, 2.0, 0.0,
  // 左下
  -0.5, -0.5, 0, 0.0, 0.0,
  // 左上
  -0.5, 0.5, 0.0, 0.0, 2.0,
]);
const P_Z = vertices.BYTES_PER_ELEMENT;
const indices = new Int8Array([0, 1, 3, 1, 2, 3]);

export interface PlaneRsp {
  indices: Int8Array;
  vbo: WebGLBuffer | null;
  ebo: WebGLBuffer | null;
}

export default function usePlane(repeat = true) {
  const plane = useCallback((w: Webgl) => {
    const { gl } = w;
    let vertData = vertices;
    // 顶点坐标数据
    if (!repeat) {
      vertData = vertData.map((it) => (it === 2.0 ? 1.0 : it));
    }

    const vbo = gl.createBuffer(); // 缓冲对象(顶点)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertData, gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * P_Z, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * P_Z, 3 * P_Z);
    gl.enableVertexAttribArray(1);

    const ebo = gl.createBuffer(); // 生成缓冲对象(索引)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return { indices, vbo, ebo, P_Z };
  }, []);

  return plane;
}
