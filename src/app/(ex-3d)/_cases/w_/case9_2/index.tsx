import { mat4, vec3, glMatrix } from "gl-matrix";
import { useCallback } from "react";
import useWebgl from "@/app/(ex-3d)/_hooks/w_/useWebgl";
import useCube from "@/app/(ex-3d)/_hooks/w_/useCube";
import useGui from "@/app/(ex-3d)/_hooks/w_/useGui";
import vs from "./p_l.vs";
import fs from "./p_l.fs";
import fs_single from "./p_l_s.fs";

const marbleUrl = "/w_/marble.jpg";
const metalUrl = "/w_/metal.png";

export default function Case9_1() {
  const box = useCube();
  const { state } = useGui({
    camera: {
      fovy: 45,
      position: [5, 6, 8] as Tuple<number, 3>,
    },
  });

  useWebgl(
    "#case9",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, createTexture } = w;
        const { cube, plane } = box(w);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.STENCIL_TEST); // 开启模板测试
        gl.stencilMask(0xff); // 默认值, 不影响输出
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE); // 设置模板缓冲更新策略

        const textures = await Promise.all([
          createTexture(marbleUrl, 0),
          createTexture(metalUrl, 1),
        ]);
        const shader = createShader(vs, fs);
        const s_shader = createShader(vs, fs_single);

        render(() => {
          gl.clear(
            gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT
          );
          gl.clearColor(0.0, 0.0, 0.0, 1.0);

          const pMat = mat4.perspective(
            mat4.create(),
            glMatrix.toRadian(state.camera.fovy),
            view.aspect,
            0.1,
            100
          );
          const vMat = mat4.lookAt(
            mat4.create(),
            vec3.fromValues(...state.camera.position),
            vec3.fromValues(0, 0, 0),
            vec3.fromValues(0, 1, 0)
          );
          let mMat = mat4.create();

          s_shader.use();
          s_shader.setMat("projection", pMat);
          s_shader.setMat("view", vMat);

          shader.use();
          shader.setMat("projection", pMat);
          shader.setMat("view", vMat);
          shader.setMat("model", mMat);

          // plane
          gl.stencilMask(0x00); // 禁止模板缓冲更新
          gl.bindVertexArray(plane.vao);
          textures[1].use();
          shader.setInt("texture1", textures[1].unit);
          gl.drawArrays(gl.TRIANGLES, 0, plane.size);

          // cube
          gl.stencilMask(0xff); // 开启模板缓冲更新
          gl.stencilFunc(gl.ALWAYS, 1, 0xff); //1. 片段都会通过模板测试, 更新模板缓冲值为1
          gl.bindVertexArray(cube.vao);
          textures[0].use();
          mMat = mat4.create();
          mat4.translate(mMat, mMat, vec3.fromValues(0, -0.5, 0));
          shader.setMat("model", mMat);
          shader.setInt("texture1", textures[0].unit);
          gl.drawArrays(gl.TRIANGLES, 0, cube.size);

          gl.stencilMask(0x00); //2. 禁止模板缓冲更新
          gl.stencilFunc(gl.NOTEQUAL, 1, 0xff); //4. 模板缓冲区值不为1的片段 通过测试, 其他片段舍弃
          // gl.disable(gl.DEPTH_TEST);
          s_shader.use();
          mMat = mat4.create();
          mat4.translate(mMat, mMat, vec3.fromValues(0, -0.5, 0));
          mat4.scale(mMat, mMat, vec3.fromValues(1.05, 1.05, 1.05)); //3. 放大模型, 只有放大区间片段通过模板测试。
          s_shader.setMat("model", mMat);
          gl.drawArrays(gl.TRIANGLES, 0, cube.size);

          //5. 重置模板测试策略
          gl.stencilMask(0xff);
          gl.stencilFunc(gl.ALWAYS, 1, 0xff);
          // gl.enable(gl.DEPTH_TEST);
        });
      },
      [box, state]
    )
  );

  return <div id="case9" className="w-full h-full" />;
}
