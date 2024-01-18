import useWebgl from "@/app/(ex-3d)/_hooks/w_/useWebgl";
import { mat4, vec3 } from "gl-matrix";
import { useCallback } from "react";
import useBox from "@/app/(ex-3d)/_hooks/w_/useBox";

// 光源位置
import pos_vs from "./pos.vs";
import pos_fs from "./pos.fs";

// 点光源
import vs_frag from "./p_l.vs";
import fs_frag from "./p_l.fs";

export default function Case7_1() {
  const box = useBox(true);

  useWebgl(
    "#case7",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader } = w;
        const { vao, pointNum } = box(w);

        gl.enable(gl.DEPTH_TEST);

        // 相机位置
        const viewPos: Tuple<number, 3> = [0, 0, 5];

        const shader = createShader(vs_frag, fs_frag);
        shader.use();
        const l_color = [1.0, 1.0, 1.0]; // 光源颜色
        const l_pos = [0.5, -0.6, 1.5]; // 光源位置

        // 点光源
        shader.setFloat("pointColor", l_color);
        shader.setFloat("pointPos", l_pos);

        // 镜面光照
        shader.setFloat("viewPos", viewPos); // 观察者位置
        shader.setFloat("specularStren", 0.5); // 强度

        // 环境光
        shader.setFloat("ambStren", 0.1);

        // 光源位置(立方体代表)
        const pos_shader = createShader(pos_vs, pos_fs);
        pos_shader.use();
        pos_shader.setNumber("color", l_color);

        let last = Date.now();
        const ANGLE_STEP = 3.0;
        let currentAngle = 0;

        // 键盘移动光源位置
        const handler: (ev: KeyboardEvent) => void = (ev) => {
          if (ev.key === "d") {
            l_pos[0] += 0.1;
          }
          if (ev.key === "a") {
            l_pos[0] -= 0.1;
          }

          if (ev.key === "w") {
            l_pos[1] += 0.1;
          }
          if (ev.key === "s") {
            l_pos[1] -= 0.1;
          }
        };
        window.addEventListener("keydown", handler, false);

        render((now) => {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.clearColor(0.0, 0.0, 0.0, 1.0);

          const elapsed = now - last;
          last = now;
          currentAngle = (currentAngle + (ANGLE_STEP * elapsed) / 3000.0) % 360;

          const vMat = mat4.lookAt(
            mat4.create(),
            vec3.fromValues(...(viewPos as Tuple<number, 3>)),
            vec3.fromValues(0, 0, 0),
            vec3.fromValues(0, 1, 0)
          );
          const pMat = mat4.perspective(
            mat4.create(),
            45,
            view.aspect,
            0.1,
            100
          );

          // 光源位置
          pos_shader.use();
          pos_shader.setMat("view", vMat);
          pos_shader.setMat("projection", pMat);
          const pos_mMat = mat4.create();
          mat4.translate(
            pos_mMat,
            pos_mMat,
            vec3.fromValues(...(l_pos as Tuple<number, 3>))
          );
          mat4.scale(pos_mMat, pos_mMat, vec3.fromValues(0.1, 0.1, 0.1));
          pos_shader.setMat("model", pos_mMat);
          gl.bindVertexArray(vao);
          gl.drawElements(gl.TRIANGLES, pointNum, gl.UNSIGNED_BYTE, 0);

          // 光照物体
          shader.use();
          shader.setMat("view", vMat);
          shader.setMat("projection", pMat);
          const mMat = mat4.create(); // 模型矩阵
          mat4.rotate(mMat, mMat, currentAngle, vec3.fromValues(1, 1, 0));
          mat4.scale(mMat, mMat, vec3.fromValues(0.5, 0.5, 0.5));
          shader.setMat("model", mMat);
          const nMat = mat4.transpose(
            mat4.create(),
            mat4.invert(mat4.create(), mMat)
          ); // 模型矩阵-逆转置矩阵
          shader.setMat("normal", nMat);

          shader.setFloat("pointPos", l_pos); // 键盘移动光源位置

          gl.bindVertexArray(vao);
          gl.drawElements(gl.TRIANGLES, pointNum, gl.UNSIGNED_BYTE, 0);

          return () => {
            window.removeEventListener("keydown", handler, false);
          };
        });
      },
      [box]
    )
  );

  return <div id="case7" className="w-full h-full" />;
}
