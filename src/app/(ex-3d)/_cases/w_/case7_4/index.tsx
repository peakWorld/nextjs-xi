import useWebgl from "@/app/(ex-3d)/_hooks/w_/useWebgl";
import { mat4, vec3 } from "gl-matrix";
import { useCallback } from "react";
import useBox, { positions } from "@/app/(ex-3d)/_hooks/w_/useBox2";

// 光源位置
import pos_vs from "./pos.vs";
import pos_fs from "./pos.fs";

import vs_frag from "./p_l.vs";
import fs_frag from "./p_l.fs"; // 平行光
import fs_frag_2 from "./p_l_2.fs"; // 点光源(衰减)
import fs_frag_3 from "./p_l_3.fs"; // 点光源(聚光)
import fs_frag_4 from "./p_l_4.fs"; // 点光源(聚光-软化)

const faceUrl = "/w_/container2.png";
const specularUrl = "/w_/container2_specular.png";

export default function Case7_4() {
  const box = useBox();

  useWebgl(
    "",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, createTexture } = w;
        const { vao, size } = box(w);

        gl.enable(gl.DEPTH_TEST);

        const viewPos: Tuple<number, 3> = [0, 0, 5]; // 相机位置
        const l_color: Tuple<number, 3> = [0.5, 0.5, 0.5]; // 平行光颜色

        await Promise.all([
          createTexture(faceUrl, 0),
          createTexture(specularUrl, 1),
        ]);
        const shader = createShader(vs_frag, fs_frag);
        shader.use();
        shader.setFloat("viewPos", viewPos); // 观察者位置
        shader.setFloat("light.direction", [-0.2, -1.0, -0.3]); // 平行光方向
        // 光照
        shader.setFloat("light.ambient", [0.2, 0.2, 0.2]);
        shader.setFloat("light.diffuse", l_color);
        shader.setFloat("light.specular", [1.0, 1.0, 1.0]);
        // 纹理材质
        shader.setInt("material.diffuse", 0);
        shader.setInt("material.specular", 1);
        shader.setFloat("material.shininess", 32);

        let last = Date.now();
        const ANGLE_STEP = 3.0;
        let currentAngle = 0;

        render((now) => {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.clearColor(0.0, 0.0, 0.0, 1.0);

          const elapsed = now - last;
          last = now;
          currentAngle = (currentAngle + (ANGLE_STEP * elapsed) / 1000.0) % 360;

          // 光照物体
          shader.use();
          const vMat = mat4.lookAt(
            mat4.create(),
            vec3.fromValues(...viewPos),
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
          shader.setMat("view", vMat);
          shader.setMat("projection", pMat);

          gl.bindVertexArray(vao);
          for (let i = 0; i < positions.length; i++) {
            const mMat = mat4.create(); // 模型矩阵
            mat4.translate(mMat, mMat, vec3.fromValues(...positions[i]));
            mat4.rotate(mMat, mMat, currentAngle, vec3.fromValues(1, 1, 0));
            shader.setMat("model", mMat);
            const nMat = mat4.transpose(
              mat4.create(),
              mat4.invert(mat4.create(), mMat)
            ); // 模型矩阵-逆转置矩阵
            shader.setMat("normal", nMat);
            gl.drawArrays(gl.TRIANGLES, 0, size);
          }
        });
      },
      [box]
    )
  );

  useWebgl(
    "",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, createTexture } = w;
        const { vao, size } = box(w);

        gl.enable(gl.DEPTH_TEST);

        const viewPos: Tuple<number, 3> = [0, 0, 5]; // 相机位置
        const l_color: Tuple<number, 3> = [0.5, 0.5, 0.5]; // 光源颜色
        const l_pos: Tuple<number, 3> = [1.2, 1.0, 2.0]; // 光源位置

        await Promise.all([
          createTexture(faceUrl, 0),
          createTexture(specularUrl, 1),
        ]);
        const shader = createShader(vs_frag, fs_frag_2);
        shader.use();
        shader.setFloat("viewPos", viewPos); // 观察者位置
        shader.setFloat("light.position", l_pos); // 光源位置
        // 光照
        shader.setFloat("light.ambient", [0.2, 0.2, 0.2]);
        shader.setFloat("light.diffuse", l_color);
        shader.setFloat("light.specular", [1.0, 1.0, 1.0]);
        // 光照衰减系数
        shader.setFloat("light.constant", 1.0);
        shader.setFloat("light.linear", 0.09);
        shader.setFloat("light.quadratic", 0.032);

        // 纹理材质
        shader.setInt("material.diffuse", 0);
        shader.setInt("material.specular", 1);
        shader.setFloat("material.shininess", 32);

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

          if (ev.key === "j") {
            l_pos[2] += 0.1;
          }
          if (ev.key === "l") {
            l_pos[2] -= 0.1;
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
            vec3.fromValues(...viewPos),
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
          mat4.translate(pos_mMat, pos_mMat, vec3.fromValues(...l_pos));
          mat4.scale(pos_mMat, pos_mMat, vec3.fromValues(0.1, 0.1, 0.1));
          pos_shader.setMat("model", pos_mMat);
          gl.bindVertexArray(vao);
          gl.drawArrays(gl.TRIANGLES, 0, size);

          shader.use();
          shader.setMat("view", vMat);
          shader.setMat("projection", pMat);
          shader.setFloat("light.position", l_pos); // 键盘移动光源位置

          for (let i = 0; i < positions.length; i++) {
            const mMat = mat4.create(); // 模型矩阵
            mat4.translate(mMat, mMat, vec3.fromValues(...positions[i]));
            mat4.rotate(mMat, mMat, currentAngle, vec3.fromValues(1, 1, 0));
            shader.setMat("model", mMat);
            const nMat = mat4.transpose(
              mat4.create(),
              mat4.invert(mat4.create(), mMat)
            ); // 模型矩阵-逆转置矩阵
            shader.setMat("normal", nMat);
            gl.drawArrays(gl.TRIANGLES, 0, size);
          }

          return () => {
            window.removeEventListener("keydown", handler, false);
          };
        });
      },
      [box]
    )
  );

  useWebgl(
    "",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, createTexture } = w;
        const { vao, size } = box(w);

        gl.enable(gl.DEPTH_TEST);

        const viewPos: Tuple<number, 3> = [0, 0, 3]; // 相机位置
        const l_color: Tuple<number, 3> = [0.8, 0.8, 0.8]; // 光源颜色
        const l_pos: Tuple<number, 3> = viewPos; // 光源位置

        await Promise.all([
          createTexture(faceUrl, 0),
          createTexture(specularUrl, 1),
        ]);
        const shader = createShader(vs_frag, fs_frag_3);
        shader.use();
        shader.setFloat("viewPos", viewPos); // 观察者位置
        shader.setFloat("light.position", l_pos); // 光源位置[与相机同步]
        shader.setFloat("light.direction", [0, 0, -1]); // 光源方向[与相机同步]
        shader.setFloat("light.cutOff", Math.cos(25)); // 聚光半径的切光角

        // 光照
        shader.setFloat("light.ambient", [0.2, 0.2, 0.2]);
        shader.setFloat("light.diffuse", l_color);
        shader.setFloat("light.specular", [1.0, 1.0, 1.0]);
        // 光照衰减系数
        shader.setFloat("light.constant", 1.0);
        shader.setFloat("light.linear", 0.09);
        shader.setFloat("light.quadratic", 0.032);

        // 纹理材质
        shader.setInt("material.diffuse", 0);
        shader.setInt("material.specular", 1);
        shader.setFloat("material.shininess", 32);

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

          if (ev.key === "j") {
            l_pos[2] += 0.1;
          }
          if (ev.key === "l") {
            l_pos[2] -= 0.1;
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
            vec3.fromValues(...viewPos),
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
          mat4.translate(pos_mMat, pos_mMat, vec3.fromValues(...l_pos));
          mat4.scale(pos_mMat, pos_mMat, vec3.fromValues(0.1, 0.1, 0.1));
          pos_shader.setMat("model", pos_mMat);
          gl.bindVertexArray(vao);
          gl.drawArrays(gl.TRIANGLES, 0, size);

          shader.use();
          shader.setMat("view", vMat);
          shader.setMat("projection", pMat);
          shader.setFloat("light.position", l_pos); // 键盘移动光源位置

          for (let i = 0; i < positions.length; i++) {
            const mMat = mat4.create(); // 模型矩阵
            mat4.translate(mMat, mMat, vec3.fromValues(...positions[i]));
            mat4.rotate(mMat, mMat, currentAngle, vec3.fromValues(1, 1, 0));
            shader.setMat("model", mMat);
            const nMat = mat4.transpose(
              mat4.create(),
              mat4.invert(mat4.create(), mMat)
            ); // 模型矩阵-逆转置矩阵
            shader.setMat("normal", nMat);
            gl.drawArrays(gl.TRIANGLES, 0, size);
          }

          return () => {
            window.removeEventListener("keydown", handler, false);
          };
        });
      },
      [box]
    )
  );

  useWebgl(
    "#case7",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, createTexture } = w;
        const { vao, size } = box(w);

        gl.enable(gl.DEPTH_TEST);

        const viewPos: Tuple<number, 3> = [0, 0, 3]; // 相机位置
        const l_color: Tuple<number, 3> = [0.8, 0.8, 0.8]; // 光源颜色
        const l_pos: Tuple<number, 3> = viewPos; // 光源位置

        await Promise.all([
          createTexture(faceUrl, 0),
          createTexture(specularUrl, 1),
        ]);
        const shader = createShader(vs_frag, fs_frag_4);
        shader.use();
        shader.setFloat("viewPos", viewPos); // 观察者位置
        shader.setFloat("light.position", l_pos); // 光源位置
        shader.setFloat("light.direction", [0, 0, -1]); // 光源方向
        shader.setFloat("light.cutOff", Math.cos(12.5)); // 内圆锥切光角余弦值
        shader.setFloat("light.outerCutOff", Math.cos(25)); // 外圆锥切光角余弦值

        // 光照
        shader.setFloat("light.ambient", [0.2, 0.2, 0.2]);
        shader.setFloat("light.diffuse", l_color);
        shader.setFloat("light.specular", [1.0, 1.0, 1.0]);
        // 光照衰减系数
        shader.setFloat("light.constant", 1.0);
        shader.setFloat("light.linear", 0.09);
        shader.setFloat("light.quadratic", 0.032);

        // 纹理材质
        shader.setInt("material.diffuse", 0);
        shader.setInt("material.specular", 1);
        shader.setFloat("material.shininess", 32);

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

          if (ev.key === "j") {
            l_pos[2] += 0.1;
          }
          if (ev.key === "l") {
            l_pos[2] -= 0.1;
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
            vec3.fromValues(...viewPos),
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

          shader.use();
          shader.setMat("view", vMat);
          shader.setMat("projection", pMat);
          shader.setFloat("light.position", l_pos); // 键盘移动光源位置

          gl.bindVertexArray(vao);
          for (let i = 0; i < positions.length; i++) {
            const mMat = mat4.create(); // 模型矩阵
            mat4.translate(mMat, mMat, vec3.fromValues(...positions[i]));
            mat4.rotate(mMat, mMat, currentAngle, vec3.fromValues(1, 1, 0));
            shader.setMat("model", mMat);
            const nMat = mat4.transpose(
              mat4.create(),
              mat4.invert(mat4.create(), mMat)
            ); // 模型矩阵-逆转置矩阵
            shader.setMat("normal", nMat);
            gl.drawArrays(gl.TRIANGLES, 0, size);
          }

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
