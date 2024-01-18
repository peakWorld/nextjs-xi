import { mat4, vec3 } from "gl-matrix";
import { useCallback } from "react";
import usePlane from "@/app/(ex-3d)/_hooks/w_/usePlane";
import useBox from "@/app/(ex-3d)/_hooks/w_/useBox";
import useWebgl from "@/app/(ex-3d)/_hooks/w_/useWebgl";
import vs from "./base.vs";
import fs from "./base.fs";
import fs_p from "../case4/transform.fs";
import vs_p from "../case4/transform.vs";

const faceUrl = "/w_/awesomeface.png";
const boxUrl = "/w_/container.jpg";

export default function Case5() {
  const plane = usePlane(false);
  const box = useBox(false, false);

  // box
  useWebgl(
    "#case5",
    useCallback(async (w) => {
      const { gl, view, render, createShader } = w;

      // Create a cube
      //    v6----- v5
      //   /|      /|
      //  v1------v0|
      //  | |     | |
      //  | |v7---|-|v4
      //  |/      |/
      //  v2------v3

      const vertices = new Float32Array([
        // 顶点
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
        1.0, // v0-v1-v2-v3 前
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
        -1.0, // v0-v3-v4-v5 右
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
        1.0, // v0-v5-v6-v1 上
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
        1.0, // v1-v6-v7-v2 左
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
        1.0, // v7-v4-v3-v2 下
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
        -1.0, // v4-v7-v6-v5 后
      ]);

      const colors = new Float32Array([
        // 颜色
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
        1.0, // v0-v1-v2-v3 前(blue)
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
        0.4, // v0-v3-v4-v5 右(green)
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
        0.4, // v0-v5-v6-v1 上(red)
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
        0.4, // v1-v6-v7-v2 左
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
        1.0, // v7-v4-v3-v2 下
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
        1.0, // v4-v7-v6-v5 后
      ]);

      const indices = new Uint8Array([
        0,
        1,
        2,
        0,
        2,
        3, // 前
        4,
        5,
        6,
        4,
        6,
        7, // 右
        8,
        9,
        10,
        8,
        10,
        11, // 上
        12,
        13,
        14,
        12,
        14,
        15, // 左
        16,
        17,
        18,
        16,
        18,
        19, // 下
        20,
        21,
        22,
        20,
        22,
        23, // 后
      ]);

      const P_Z = vertices.BYTES_PER_ELEMENT;

      gl.enable(gl.DEPTH_TEST);

      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

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

      const ebo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

      gl.bindVertexArray(null);

      const shader = createShader(vs, fs);
      shader.use();

      const mvp = mat4.create();
      const pMat = mat4.create();
      const vMat = mat4.create();

      // win resize aspect 发生改变
      // 但是此刻的 view.aspect 还是首次值, 导致变形
      // 将mat4计算放入render函数中处理
      mat4.perspective(pMat, 30, view.aspect, 0.1, 100);
      mat4.lookAt(
        vMat,
        vec3.fromValues(3, 3, 3),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 1, 0)
      );
      mat4.multiply(mvp, pMat, vMat);
      shader.setMat("mvp", mvp);

      render(() => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.2, 0.2, 0.2, 1);

        shader.use();
        gl.bindVertexArray(vao);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
      });
    }, [])
  );

  // 多个shader
  useWebgl(
    "",
    useCallback(async (w) => {
      const { gl, view, render, createShader, createTexture } = w;

      gl.enable(gl.DEPTH_TEST);

      // box
      const vaoBox = gl.createVertexArray();
      gl.bindVertexArray(vaoBox);
      const boxRsp = box(w);
      gl.bindVertexArray(null);

      const shader = createShader(vs, fs);
      shader.use();
      const mvp = mat4.create();
      const pMat = mat4.create();
      const vMat = mat4.create();
      mat4.perspective(pMat, 30, view.aspect, 0.1, 100);
      mat4.lookAt(
        vMat,
        vec3.fromValues(3, 3, 3),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 1, 0)
      );
      mat4.multiply(mvp, pMat, vMat);
      shader.setMat("mvp", mvp);

      // plane
      const vaoPlane = gl.createVertexArray();
      gl.bindVertexArray(vaoPlane);
      const planeRsp = plane(w);
      gl.bindVertexArray(null);
      await Promise.all([createTexture(boxUrl, 0), createTexture(faceUrl, 1)]);

      const shader2 = createShader(vs_p, fs_p);
      shader2.use();
      shader2.setInt("texture1", 0);
      shader2.setInt("texture2", 1);

      const transform = mat4.create();
      mat4.translate(transform, transform, vec3.fromValues(0.5, 0.5, 0)); // 位移
      mat4.rotateZ(transform, transform, Math.PI / 4); // 旋转 90
      mat4.scale(transform, transform, vec3.fromValues(0.5, 0.5, 0)); // 缩放
      shader2.setMat("transform", transform);

      render(() => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.2, 0.2, 0.2, 1);

        shader.use();
        // gl.bindVertexArray(vaoBox)
        gl.bindBuffer(gl.ARRAY_BUFFER, boxRsp.vbo);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * boxRsp.P_Z, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, boxRsp.vboColor);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 3 * boxRsp.P_Z, 0);
        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxRsp.ebo);

        gl.drawElements(
          gl.TRIANGLES,
          boxRsp.indices.length,
          gl.UNSIGNED_BYTE,
          0
        );

        shader2.use();
        // gl.bindVertexArray(vaoPlane)
        gl.bindBuffer(gl.ARRAY_BUFFER, planeRsp.vbo);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * planeRsp.P_Z, 0);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(
          1,
          2,
          gl.FLOAT,
          false,
          5 * planeRsp.P_Z,
          3 * planeRsp.P_Z
        );
        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeRsp.ebo);

        gl.drawElements(
          gl.TRIANGLES,
          planeRsp.indices.length,
          gl.UNSIGNED_BYTE,
          0
        );
      });
    }, [])
  );

  return <div id="case5" className="w-full h-full" />;
}
