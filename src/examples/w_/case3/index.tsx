import { useCallback } from "react";
import useWebgl from "@/hooks/useWebgl";
import { Webgl } from "@/libs/webgl";
import vs from "./texture.vs";
import fs from "./texture.fs";
import fs_mul from "./texture_mul.fs";

const boxUrl = "/w_/container.jpg";
const faceUrl = "/w_/awesomeface.png";

export default function Case3() {
  const common = useCallback((w: Webgl) => {
    const { gl } = w;
    // 顶点坐标数据
    const vertices = new Float32Array([
      // 右上
      0.5, 0.5, 0, 2.0, 2.0,
      // 右下
      0.5, -0.5, 0, 2.0, 0.0,
      // 左下
      -0.5, -0.5, 0, 0.0, 0.0,
      // 左上
      -0.5, 0.5, 0.0, 0.0, 2.0,
    ]);
    const P_Z = vertices.BYTES_PER_ELEMENT;
    const indices = new Int8Array([0, 1, 3, 1, 2, 3]);

    const vbo = gl.createBuffer(); // 缓冲对象(顶点)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * P_Z, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * P_Z, 3 * P_Z);
    gl.enableVertexAttribArray(1);

    const ebo = gl.createBuffer(); // 生成缓冲对象(索引)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices;
  }, []);

  useWebgl(
    "#case3",
    useCallback(
      async (w) => {
        const { gl, render, createShader, createTexture } = w;
        const indices = common(w);

        await createTexture(boxUrl, 0); // 创建绑定纹理单元

        const shader = createShader(vs, fs);
        shader.use();

        shader.setInt("texture1", 0); // 指定着色器采样器属于哪个纹理单元

        render(() => {
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.clearColor(0.2, 0.2, 0.2, 1);

          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
        });
      },
      [common]
    )
  );

  useWebgl(
    "",
    useCallback(
      async (w) => {
        const { gl, render, createShader, createTexture } = w;
        const indices = common(w);

        // 多个纹理
        await Promise.all([
          createTexture(boxUrl, 0),
          createTexture(faceUrl, 1),
        ]);

        const shader = createShader(vs, fs_mul);
        shader.use();
        shader.setInt("texture1", 0);
        shader.setInt("texture2", 1);

        let pre = 0;

        render((time) => {
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.clearColor(0.2, 0.2, 0.2, 1);

          // 200ms, 改变一次mixValue值
          if (pre === 0 || time - pre > 200) {
            shader.use();
            const op = Math.sin(time / 2 + 0.5);
            shader.setFloat("mixValue", op);
            pre = time;
          }

          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
        });
      },
      [common]
    )
  );

  return <div id="case3">Case3</div>;
}
