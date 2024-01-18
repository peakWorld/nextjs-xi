"use client";

import { useCallback } from "react";
import { Webgl } from "@/app/(ex-3d)/_utils/w_";

// Z深度大的先绘制; 深度小的后绘制 覆盖前面的
const vertices = new Float32Array([
  // 红色三角 最后面
  0.0, 0.5, -0.4, 1.0, 0.0, 0.0, -0.5, -0.5, -0.4, 1.0, 0.0, 0.0, 0.5, -0.5,
  -0.4, 1.0, 0.0, 0.0,
  // 绿色三角 中间
  0.5, 0.4, -0.2, 0.0, 1.0, 0.0, -0.5, -0.4, -0.2, 0.0, 1.0, 0.0, 0.0, -0.6,
  -0.2, 0.0, 1.0, 0.0,
  // 蓝色三角 最前面
  0.0, 0.5, 0.0, 0.0, 0.0, 1.0, -0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.5, -0.5, 0.0,
  0.0, 0.0, 1.0,
]);

const vertices2 = new Float32Array([
  // 蓝色三角
  0.0, 0.5, 0.0, 0.0, 0.0, 1.0, -0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.5, -0.5, 0.0,
  0.0, 0.0, 1.0,
  // 绿色三角
  0.5, 0.4, -0.2, 0.0, 1.0, 0.0, -0.5, -0.4, -0.2, 0.0, 1.0, 0.0, 0.0, -0.6,
  -0.2, 0.0, 1.0, 0.0,
  // 红色三角
  0.0, 0.5, -0.4, 1.0, 0.0, 0.0, -0.5, -0.5, -0.4, 1.0, 0.0, 0.0, 0.5, -0.5,
  -0.4, 1.0, 0.0, 0.0,
]);

// 蓝色和红色三角 深度不一致
const P_Z = vertices.BYTES_PER_ELEMENT;

export default function useTria(isOrder = false) {
  const tria = useCallback((w: Webgl) => {
    const { gl } = w;
    const vbo = gl.createBuffer(); // 缓冲对象(顶点)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      isOrder ? vertices : vertices2,
      gl.STATIC_DRAW
    );

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * P_Z, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * P_Z, 3 * P_Z);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vbo;
  }, []);

  return tria;
}
