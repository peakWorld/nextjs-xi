import useWebgl from "@/hooks/useWebgl";
import { mat4, vec3 } from "gl-matrix";
import { useCallback } from "react";
import useBox from "@/hooks/ex_w/useBox";
import vs from "./light.vs";
import fs from "./light.fs";

export default function Case6() {
  const box = useBox(true);

  useWebgl(
    "#case6",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, createCamera } = w;
        const { vao, pointNum } = box(w);

        gl.enable(gl.DEPTH_TEST);

        // 着色器程序
        const shader = createShader(vs, fs);
        shader.use();

        // 相机
        const camera = createCamera({ pos: [0, 0, 8] });
        w.add(camera);

        // 点光源
        shader.setFloat("lightColor", [1.0, 1.0, 1.0]);
        shader.setFloat("lightPos", [2.3, 4.0, 3.5]);
        // 环境光
        shader.setFloat("lightAmb", [0.5, 0.5, 0.5]);

        let last = Date.now();
        const ANGLE_STEP = 3.0;
        let currentAngle = 0;

        render((now) => {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.clearColor(0.0, 0.0, 0.0, 1.0);

          const elapsed = now - last;
          last = now;
          currentAngle = (currentAngle + (ANGLE_STEP * elapsed) / 1000.0) % 360;

          shader.use();

          const mMat = mat4.create(); // 模型矩阵
          mat4.rotate(mMat, mMat, currentAngle, vec3.fromValues(1, 1, 0));

          // 视图 x 模型
          const mvMat = mat4.multiply(
            mat4.create(),
            camera.getViewMat(now),
            mMat
          );
          // 裁剪 x 视图 x 模型
          const mvp = mat4.multiply(
            mat4.create(),
            mat4.perspective(mat4.create(), camera.Zoom, view.aspect, 0.1, 100),
            mvMat
          );

          shader.setMat("mvp", mvp);
          shader.setMat("modelMat", mMat);

          // 模型矩阵-逆转置矩阵
          const nMat = mat4.transpose(
            mat4.create(),
            mat4.invert(mat4.create(), mMat)
          );
          shader.setMat("normalMat", nMat);

          gl.bindVertexArray(vao);

          gl.drawElements(gl.TRIANGLES, pointNum, gl.UNSIGNED_BYTE, 0);
        });
      },
      [box]
    )
  );

  return <div id="case6">Case6</div>;
}
