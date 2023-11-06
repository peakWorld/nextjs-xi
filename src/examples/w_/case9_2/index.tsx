import { mat4, vec3, glMatrix } from "gl-matrix";
import { useCallback } from "react";
import useWebgl from "@/hooks/useWebgl";
import useCube from "@/hooks/t_w/useCube";
import useGui from "@/hooks/t_w/useGui";
import vs from "./p_l.vs";
import fs from "./p_l.fs";
const marbleUrl = "/w_/marble.jpg";
const metalUrl = "/w_/metal.png";

export default function Case9_1() {
  const box = useCube();
  const { state } = useGui({
    camera: {
      fovy: 45,
      position: [0, 0, 3] as Tuple<number, 3>,
    },
  });

  useWebgl(
    "#case9",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, createTexture } = w;
        const { cube, plane } = box(w);

        gl.enable(gl.DEPTH_TEST); // 开启深度测试

        gl.enable(gl.STENCIL_TEST); // 开启模板测试
        // gl.stencilMask(0xFF); // 默认值, 不影响输出

        gl.stencilFunc(gl.EQUAL, 1, 0xfff); // 片段的取舍
        gl.stencilOp;

        const textures = await Promise.all([
          createTexture(marbleUrl, 0),
          createTexture(metalUrl, 1),
        ]);
        const shader = createShader(vs, fs);
        shader.use();

        render(() => {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_TEST);
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          shader.use();
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
          const mMat = mat4.create();
          shader.setMat("projection", pMat);
          shader.setMat("view", vMat);
          shader.setMat("model", mMat);

          gl.bindVertexArray(cube.vao);
          textures[0].use();
          shader.setInt("texture1", textures[0].unit);
          gl.drawArrays(gl.TRIANGLES, 0, cube.size);

          gl.bindVertexArray(plane.vao);
          textures[1].use();
          shader.setInt("texture1", textures[1].unit);
          gl.drawArrays(gl.TRIANGLES, 0, plane.size);
        });
      },
      [box, state]
    )
  );

  return <div id="case9">Case9</div>;
}
