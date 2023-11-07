import useWebgl from "@/hooks/useWebgl";
import { mat4, vec3 } from "gl-matrix";
import { useCallback } from "react";
import useBox from "@/hooks/ex_w/useBox2";

// 光源位置
import pos_vs from "./pos.vs";
import pos_fs from "./pos.fs";

// 点光源
import vs_frag from "./p_l.vs";
import fs_frag from "./p_l.fs";
import fs_frag_2 from "./p_l_2.fs";

export default function Case7_2() {
  const box = useBox();

  useWebgl(
    "#case7",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader } = w;
        const { vao, size } = box(w);

        gl.enable(gl.DEPTH_TEST);

        const viewPos: Tuple<number, 3> = [0, 0, 5]; // 相机位置
        const l_color: Tuple<number, 3> = [1.0, 1.0, 1.0]; // 光源颜色(将光照调暗了一些以搭配场景)
        const l_pos: Tuple<number, 3> = [0.5, -0.6, 1.5]; // 光源位置

        // 未使用light结构体, 三个分量的光照强度、颜色固定
        const shader = createShader(vs_frag, fs_frag);
        shader.use();
        shader.setFloat("pointColor", l_color);
        shader.setFloat("pointPos", l_pos);
        shader.setFloat("viewPos", viewPos);

        // 材质
        shader.setFloat("material.ambient", [1, 0.5, 0.3]);
        shader.setFloat("material.diffuse", [1, 0.5, 0.31]);
        shader.setFloat("material.specular", [0.5, 0.5, 0.5]);
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

          // 键盘移动光源位置
          shader.setFloat("light.position", l_pos);

          gl.bindVertexArray(vao);
          gl.drawArrays(gl.TRIANGLES, 0, size);

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
        const { gl, view, render, createShader } = w;
        const { vao, size } = box(w);

        gl.enable(gl.DEPTH_TEST);

        const viewPos: Tuple<number, 3> = [0, 0, 5]; // 相机位置
        const l_color: Tuple<number, 3> = [1.0, 1.0, 1.0]; // 光源颜色
        const l_pos: Tuple<number, 3> = [0.5, -0.6, 1.5]; // 光源位置

        // p_l_2.fs 三个分量设置不同的光照强度、颜色
        const shader = createShader(vs_frag, fs_frag_2);
        shader.use();
        shader.setFloat("viewPos", viewPos); // 观察者位置
        shader.setFloat("light.position", l_pos); // 光源位置
        // 光照
        shader.setFloat("light.ambient", [0.2, 0.2, 0.2]);
        shader.setFloat("light.diffuse", l_color);
        shader.setFloat("light.specular", [1.0, 1.0, 1.0]);
        // 材质
        shader.setFloat("material.ambient", [1, 0.5, 0.3]);
        shader.setFloat("material.diffuse", [1, 0.5, 0.31]);
        shader.setFloat("material.specular", [0.5, 0.5, 0.5]);
        shader.setFloat("material.shininess", 32);

        // 材质: 青色塑料 光照强度为1
        // shader.setFloat("light.ambient", [1.0, 1.0, 1.0]);
        // shader.setFloat("light.diffuse", [1.0, 1.0, 1.0]);
        // shader.setFloat("light.specular", [1.0, 1.0, 1.0]);
        // shader.setFloat("material.ambient", [0, 0.1, 0.06]);
        // shader.setFloat("material.diffuse", [0, 0.50980392, 0.50980392]);
        // shader.setFloat("material.specular", [0.50196078, 0.50196078, 0.50196078]);
        // shader.setFloat("material.shininess", 128 * 0.25);

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

          // 材质固定, 改变光的颜色和强度
          // const lightColor = vec3.create()
          // lightColor[0] = Math.sin(currentAngle * 2);
          // lightColor[1] = Math.sin(currentAngle * 0.7);
          // lightColor[2] = Math.sin(currentAngle * 1.3);
          // const diffuseColor = vec3.scale(vec3.create(), lightColor, 0.5)
          // const ambientColor = vec3.scale(vec3.create(), diffuseColor, 0.2)
          // shader.setFloat("light.ambient", [ambientColor[0], ambientColor[1], ambientColor[2]]);
          // shader.setFloat("light.diffuse", [diffuseColor[0], diffuseColor[1], diffuseColor[2]]);

          // 键盘移动光源位置
          shader.setFloat("light.position", l_pos);

          gl.bindVertexArray(vao);
          gl.drawArrays(gl.TRIANGLES, 0, size);

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
