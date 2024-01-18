import usePlane from "@/app/(ex-3d)/_hooks/w_/usePlane";
import useTria from "@/app/(ex-3d)/_hooks/w_/useTria";
import useWebgl from "@/app/(ex-3d)/_hooks/w_/useWebgl";
import { mat4, vec3 } from "gl-matrix";
import { useCallback } from "react";
import mt_fs from "./mul_triangle.fs";
import mt_vs from "./mul_triangle.vs";
import fs from "./transform.fs";
import vs from "./transform.vs";
import ortho_vs from "./ortho.vs";

const faceUrl = "/w_/awesomeface.png";
const boxUrl = "/w_/container.jpg";

export default function Case5() {
  const commonPlane = usePlane(false);
  const tria = useTria(true);
  const tria2 = useTria();

  // 模型矩阵
  useWebgl(
    "#case4",
    useCallback(
      async (w) => {
        const { gl, render, createShader, createTexture } = w;
        const planeRsp = commonPlane(w);

        // 多个纹理
        await Promise.all([
          createTexture(boxUrl, 0),
          createTexture(faceUrl, 1),
        ]);

        const shader = createShader(vs, fs);
        shader.use();
        shader.setInt("texture1", 0);
        shader.setInt("texture2", 1);

        // 坐标点 先进行缩放，然后是旋转，最后才是位移
        const transform = mat4.create();
        mat4.translate(transform, transform, vec3.fromValues(0, 1, 0)); // 位移
        mat4.rotateZ(transform, transform, Math.PI / 4); // 旋转 90
        mat4.scale(transform, transform, vec3.fromValues(0.5, 0.5, 0)); // 缩放
        shader.setMat("transform", transform);

        render(() => {
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.clearColor(0.2, 0.2, 0.2, 1);

          gl.drawElements(
            gl.TRIANGLES,
            planeRsp.indices.length,
            gl.UNSIGNED_BYTE,
            0
          );
        });
      },
      [commonPlane]
    )
  );

  // 视图矩阵
  useWebgl(
    "",
    useCallback(
      async (w) => {
        const { gl, render, createShader } = w;
        tria(w);

        const shader = createShader(mt_vs, mt_fs);
        shader.use();

        // 补缺角
        // const proj = mat4.create();
        // mat4.ortho(proj, -1.0, 1.0, -1.0, 1.0, 0, 2.0);
        // shader.setMat('projection', proj);

        // 视点移动
        let eyeX = 0.2;
        const handler: (ev: KeyboardEvent) => void = (ev) => {
          if (ev.key === "d") {
            eyeX += 0.01;
          }
          if (ev.key === "a") {
            eyeX -= 0.01;
          }
        };

        window.addEventListener("keydown", handler, false);

        render(() => {
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.clearColor(0.2, 0.2, 0.2, 1);

          // 视图矩阵
          const viewMat = mat4.create();
          mat4.lookAt(
            viewMat,
            vec3.fromValues(eyeX, 0.25, 0.25),
            vec3.fromValues(0, 0, 0),
            vec3.fromValues(0, 1, 0)
          );
          shader.setMat("view", viewMat);

          gl.drawArrays(gl.TRIANGLES, 0, 9);
        });

        return () => {
          window.removeEventListener("keydown", handler, false);
        };
      },
      [tria]
    )
  );

  // 裁剪矩阵
  useWebgl(
    "",
    useCallback(
      async (w) => {
        const { gl, render, createShader } = w;
        tria(w);

        const shader = createShader(ortho_vs, mt_fs);
        shader.use();

        // 视图矩阵 视线沿Z轴负方向, 上方向沿Z轴正方向
        const viewMat = mat4.create();
        mat4.lookAt(
          viewMat,
          vec3.fromValues(0, 0, 0),
          vec3.fromValues(0, 0, -1),
          vec3.fromValues(0, 1, 0)
        );
        shader.setMat("view", viewMat);

        // 正射投影矩阵 近裁/远裁剪面
        let near = 0,
          far = 0.5;
        const handler: (ev: KeyboardEvent) => void = (ev) => {
          // 右
          if (ev.key === "d") {
            near += 0.01;
          }
          // 左
          if (ev.key === "a") {
            near -= 0.01;
          }

          // 上
          if (ev.key === "w") {
            far += 0.01;
          }
          // 下
          if (ev.key === "s") {
            far -= 0.01;
          }
          console.log("near =>", near.toFixed(2), "far =>", far.toFixed(2));
        };

        window.addEventListener("keydown", handler, false);

        render(() => {
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.clearColor(0.2, 0.2, 0.2, 1);

          shader.use();
          const projMat = mat4.create();
          mat4.ortho(projMat, -1.0, 1.0, -1.0, 1.0, near, far); // 正射投影矩阵
          // mat4.perspective(projMat, 60, w.view.aspect, 0.1, 100); // 透视投影矩阵
          shader.setMat("projection", projMat);

          gl.drawArrays(gl.TRIANGLES, 0, 9);
        });

        return () => {
          window.removeEventListener("keydown", handler, false);
        };
      },
      [tria]
    )
  );

  // 深度测试
  useWebgl(
    "",
    useCallback(
      async (w) => {
        const { gl, view, render, createShader, setScissor } = w;

        gl.enable(gl.SCISSOR_TEST);

        // gl.enable(gl.DEPTH_TEST | gl.POLYGON_OFFSET_FILL); // 深度测试 | 多边形偏移

        tria(w);
        tria2(w);

        const shader = createShader(ortho_vs, mt_fs);
        shader.use();

        // 视图矩阵 视线沿Z轴负方向, 上方向沿Z轴正方向
        const viewMat = mat4.create();
        mat4.lookAt(
          viewMat,
          vec3.fromValues(0, 0, 0),
          vec3.fromValues(0, 0, -1),
          vec3.fromValues(0, 1, 0)
        );
        shader.setMat("view", viewMat);

        const projMat = mat4.create();
        mat4.ortho(projMat, -1.0, 1.0, -1.0, 1.0, 0, 1.0); // 正射投影矩阵
        // mat4.ortho(projMat, -1.0, 1.0, -2.0, 2.0, 0, 1.0); // 分屏(满足视图和canvas大小一致, 保证物品展示正确)
        shader.setMat("projection", projMat);

        render(() => {
          setScissor({ w: view.w / 2, h: view.h });
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.clearColor(0.3, 0.3, 0.3, 1);
          tria(w);
          gl.drawArrays(gl.TRIANGLES, 0, 9);

          setScissor({ x: view.w / 2, w: view.w / 2, h: view.h });
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.clearColor(0.3, 0.5, 0.3, 1);
          tria2(w);
          // gl.polygonOffset(1.0, 1.0); // 设置多边形偏移
          gl.drawArrays(gl.TRIANGLES, 0, 9);
        });
      },
      [tria, tria2]
    )
  );

  return <div id="case4" className="w-full h-full" />;
}
