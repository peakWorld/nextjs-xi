import { useCallback } from "react";
import useWebgl from "@/hooks/useWebgl";
import a_fs from "./attrib.fs";
import a_vs from "./attrib.vs";
import u_fs from "./uniform.fs";
import u_vs from "./uniform.vs";

export default function Case2() {
  // 顶点缓冲对象
  useWebgl(
    "#case2",
    useCallback((w) => {
      const { gl, render, createShader } = w;

      // 顶点坐标数据
      const vertices = new Float32Array([
        0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0,
        // 0.5, 0.5, 0, -0.5, -0.5, 0, -0.5, 0.5, 0
      ]);
      const P_Z = vertices.BYTES_PER_ELEMENT;

      // 将坐标数据拷贝到GPU, 供OpenGL使用
      const vbo = gl.createBuffer(); // 生成缓冲对象(顶点)
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo); // 将vbo绑定到ARRAY_BUFFER(缓冲类型)上, 与GPU绑定
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 将顶点数据复制到vbo, 将数据刷到GPU

      // 配置顶点属性(顶点作色器中的属性), OpenGL使用数据
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * P_Z, 0); // 告诉OpenGL如何解析数据
      gl.enableVertexAttribArray(0); // 启用顶点属性

      const shader = createShader(a_vs, a_fs);

      render(() => {
        gl.clear(gl.COLOR_BUFFER_BIT); // 清空颜色缓冲区
        gl.clearColor(0.2, 0.3, 0.3, 1); // 设置屏幕颜色

        // 选定渲染管道(着色器程序)
        shader.use();

        // 按顶点坐标顺序绘制
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      });
    }, [])
  );

  // 索引缓冲对象
  useWebgl(
    "",
    useCallback((w) => {
      const { gl, render, createShader } = w;

      const vertices = new Float32Array([
        0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0, -0.5, 0.5, 0.0,
      ]);
      const P_Z = vertices.BYTES_PER_ELEMENT;
      // 数组中每个值 表示 vertices中点的位置
      // 数组的顺序 表示 点的绘制顺序
      const indices = new Int8Array([0, 1, 3, 1, 2, 3]);

      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * P_Z, 0);
      gl.enableVertexAttribArray(0);

      const ebo = gl.createBuffer(); // 生成缓冲对象(索引)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo); // 将ebo绑定到ELEMENT_ARRAY_BUFFER(缓冲类型)上
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

      const shader = createShader(a_vs, a_fs);

      render(() => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clearColor(0.2, 0.3, 0.3, 1);

        shader.use();

        // 按索引缓冲对象绘制
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
      });
    }, [])
  );

  // uniform常量
  useWebgl(
    "",
    useCallback((w) => {
      const { gl, render, createShader } = w;
      const vertices = new Float32Array([
        // 顶点坐标(右下)      // 顶点颜色
        0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
        // 顶点坐标(左下)       // 顶点颜色
        -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
        // 顶点坐标(顶部)     // 顶点颜色
        0.0, 0.5, 0.0, 0.0, 0.0, 1.0,
      ]);
      const P_Z = vertices.BYTES_PER_ELEMENT;

      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      // 一个数据集被多个顶点属性使用
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * P_Z, 0);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * P_Z, 3 * P_Z);
      gl.enableVertexAttribArray(1);

      const shader = createShader(u_vs, u_fs);

      render((time) => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clearColor(0.2, 0.3, 0.3, 1);

        shader.use();
        // unifrom常量
        // const op = Math.sin(time / 2 + 0.5);
        // shader.setFloat("uColor", op);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
      });
    }, [])
  );
  return <div id="case2"></div>;
}
