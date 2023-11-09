import { mat4, vec3, glMatrix } from "gl-matrix";
import { useCallback } from "react";
import useWebgl from "@/hooks/useWebgl";
import useCube from "@/hooks/ex_w/useCube";
import useGui from "@/hooks/ex_w/useGui";
import vs from "./p_l.vs";
import fs from "./p_l.fs";
const marbleUrl = "/w_/marble.jpg";
const metalUrl = "/w_/metal.png";
const grassUrl = "/w_/grass.png";

export default function Case9_1() {
  const box = useCube();
  const { state } = useGui({
    camera: {
      fovy: 45,
      position: [3, 3, 3] as Tuple<number, 3>,
    },
  });

  useWebgl(
    "#case10",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, createTexture } = w;
        const { cube, plane, face } = box(w);

        gl.enable(gl.DEPTH_TEST);

        const textures = await Promise.all([
          createTexture(metalUrl, 0),
          createTexture(marbleUrl, 1),
          createTexture(grassUrl, 2, true),
        ]);
        const shader = createShader(vs, fs);
        shader.use();

        const pos: Tuple<number, 3>[] = [
          [-1.5, 0.0, -0.48],
          [1.5, 0.0, 0.51],
          [0.0, 0.0, 0.7],
          [-0.3, 0.0, -2.3],
          [0.5, 0.0, -0.6],
        ];

        render(() => {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
          shader.setMat("projection", pMat);
          shader.setMat("view", vMat);
          shader.setMat("model", mMat);

          gl.bindVertexArray(plane.vao);
          textures[0].use();
          shader.setInt("texture1", textures[0].unit);
          gl.drawArrays(gl.TRIANGLES, 0, plane.size);

          gl.bindVertexArray(cube.vao);
          textures[1].use();
          mMat = mat4.create();
          mat4.translate(mMat, mMat, vec3.fromValues(-1, 0, -1));
          shader.setMat("model", mMat);
          shader.setInt("texture1", textures[1].unit);
          gl.drawArrays(gl.TRIANGLES, 0, cube.size);

          gl.bindVertexArray(face.vao);
          textures[2].use();
          shader.setInt("texture1", textures[2].unit);
          for (let i = 0, len = pos.length; i < len; i++) {
            mMat = mat4.create();
            mat4.translate(mMat, mMat, vec3.fromValues(...pos[i]));
            shader.setMat("model", mMat);
            gl.drawArrays(gl.TRIANGLES, 0, face.size);
          }
        });
      },
      [box, state]
    )
  );

  return <div id="case10" className="w-full h-full" />;
}
