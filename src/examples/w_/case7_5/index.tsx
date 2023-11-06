import useWebgl from "@/hooks/useWebgl";
import { mat4, vec3 } from "gl-matrix";
import { useCallback } from "react";
import useBox, { positions } from "@/hooks/t_w/useBox2";

// 光源位置
import pos_vs from "./pos.vs";
import pos_fs from "./pos.fs";

import vs_frag from "./p_l.vs";
import fs_frag from "./p_l.fs";

const faceUrl = "/w_/container2.png";
const specularUrl = "/w_/container2_specular.png";

const pointLights: Array<Tuple<number, 3>> = [
  [0.7, 0.2, 2.0],
  [2.3, -3.3, -4.0],
  [-4.0, 2.0, -12.0],
  [0.0, 0.0, -3.0],
];

export default function Case7_4() {
  const box = useBox();

  useWebgl(
    "#case7",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, createTexture } = w;
        const { size } = box(w);

        gl.enable(gl.DEPTH_TEST);

        const viewPos: Tuple<number, 3> = [0, 0, 5]; // 相机位置

        await Promise.all([
          createTexture(faceUrl, 0),
          createTexture(specularUrl, 1),
        ]);
        const shader = createShader(vs_frag, fs_frag);
        shader.use();
        shader.setFloat("viewPos", viewPos); // 观察者位置

        // directional light
        shader.setFloat("dirLight.direction", [-0.2, -1.0, -0.3]);
        shader.setFloat("dirLight.ambient", [0.05, 0.05, 0.05]);
        shader.setFloat("dirLight.diffuse", [0, 0, 0]);
        shader.setFloat("dirLight.specular", [0.5, 0.5, 0.5]);
        // point light 1
        shader.setFloat("pointLights[0].position", pointLights[0]);
        shader.setFloat("pointLights[0].ambient", [0.05, 0.05, 0.05]);
        shader.setFloat("pointLights[0].diffuse", [0.8, 0.8, 0.8]);
        shader.setFloat("pointLights[0].specular", [1.0, 1.0, 1.0]);
        shader.setFloat("pointLights[0].constant", 1.0);
        shader.setFloat("pointLights[0].linear", 0.09);
        shader.setFloat("pointLights[0].quadratic", 0.032);
        // point light 2
        shader.setFloat("pointLights[1].position", pointLights[1]);
        shader.setFloat("pointLights[1].ambient", [0.05, 0.05, 0.05]);
        shader.setFloat("pointLights[1].diffuse", [0.8, 0.8, 0.8]);
        shader.setFloat("pointLights[1].specular", [1.0, 1.0, 1.0]);
        shader.setFloat("pointLights[1].constant", 1.0);
        shader.setFloat("pointLights[1].linear", 0.09);
        shader.setFloat("pointLights[1].quadratic", 0.032);
        // point light 3
        shader.setFloat("pointLights[2].position", pointLights[2]);
        shader.setFloat("pointLights[2].ambient", [0.05, 0.05, 0.05]);
        shader.setFloat("pointLights[2].diffuse", [0.8, 0.8, 0.8]);
        shader.setFloat("pointLights[2].specular", [1.0, 1.0, 1.0]);
        shader.setFloat("pointLights[2].constant", 1.0);
        shader.setFloat("pointLights[2].linear", 0.09);
        shader.setFloat("pointLights[2].quadratic", 0.032);
        // point light 4
        shader.setFloat("pointLights[3].position", pointLights[3]);
        shader.setFloat("pointLights[3].ambient", [0.05, 0.05, 0.05]);
        shader.setFloat("pointLights[3].diffuse", [0.8, 0.8, 0.8]);
        shader.setFloat("pointLights[3].specular", [1.0, 1.0, 1.0]);
        shader.setFloat("pointLights[3].constant", 1.0);
        shader.setFloat("pointLights[3].linear", 0.09);
        shader.setFloat("pointLights[3].quadratic", 0.032);
        // spotLight
        shader.setFloat("spotLight.position", viewPos);
        shader.setFloat("spotLight.direction", [0, 0, -1]);
        shader.setFloat("spotLight.ambient", [0.0, 0.0, 0.0]);
        shader.setFloat("spotLight.diffuse", [1.0, 1.0, 1.0]);
        shader.setFloat("spotLight.specular", [1.0, 1.0, 1.0]);
        shader.setFloat("spotLight.constant", 1.0);
        shader.setFloat("spotLight.linear", 0.09);
        shader.setFloat("spotLight.quadratic", 0.032);
        shader.setFloat("spotLight.cutOff", Math.cos(12.5));
        shader.setFloat("spotLight.outerCutOff", Math.cos(15));

        // 纹理材质
        shader.setInt("material.diffuse", 0);
        shader.setInt("material.specular", 1);
        shader.setFloat("material.shininess", 32);

        // 光源位置(立方体代表)
        const pos_shader = createShader(pos_vs, pos_fs);

        let last = Date.now();
        const ANGLE_STEP = 3.0;
        let currentAngle = 0;

        let current = 0;

        // 键盘移动光源位置
        const handler: (ev: KeyboardEvent) => void = (ev) => {
          if (Number(ev.key) < 4) {
            current = Number(ev.key);
            return;
          }
          const l_pos = pointLights[current];
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
          for (let i = 0; i < pointLights.length; i++) {
            const pos_mMat = mat4.create();
            mat4.translate(
              pos_mMat,
              pos_mMat,
              vec3.fromValues(...pointLights[i])
            );
            mat4.scale(pos_mMat, pos_mMat, vec3.fromValues(0.1, 0.1, 0.1));
            pos_shader.setMat("model", pos_mMat);
            gl.drawArrays(gl.TRIANGLES, 0, size);
          }

          shader.use();
          shader.setMat("view", vMat);
          shader.setMat("projection", pMat);
          shader.setFloat(
            `pointLights[${current}].position`,
            pointLights[current]
          ); // 键盘移动光源位置

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

  return <div id="case7">Case7</div>;
}
