"use client";

import { useCallback, useEffect, useRef } from "react";
import pfs from "./point.fs";
import pvs from "./point.vs";
import pvsAttr from "./point_attr.vs";

import { Shader } from "@/libs/webgl/shader";
import useWebgl from "@/hooks/useWebgl";

export default function Case1() {
  const ref = useRef<HTMLCanvasElement>(null);
  // 1-1 基础
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2"); // 获取绘图上下文
    if (!gl) return;
    gl?.clearColor(0, 0, 0, 1.0); // 指定绘图区域的背景色
    gl?.clear(gl.COLOR_BUFFER_BIT); // 用指定的背景色清空绘图区域(指定颜色缓冲区为预定的值)

    const shader = new Shader(gl);
    shader.createProgram(pvs, pfs);
    shader.use();

    gl.drawArrays(gl.POINTS, 0, 1); // 绘制操作【点、从0开始、绘制一次】
  }, []);

  // 1-2 封装函数
  useWebgl(
    "",
    useCallback((w) => {
      const { gl, createShader } = w;

      gl?.clearColor(0, 0, 0, 1.0);
      gl?.clear(gl.COLOR_BUFFER_BIT);

      const shader = createShader(pvsAttr, pfs);
      shader.use();

      gl.vertexAttrib3f(0, 0.5, 0, 0); // 将位置传输给in类型变量 layout 0

      gl.drawArrays(gl.POINTS, 0, 1);
    }, [])
  );

  // 1-3 鼠标点击绘制点
  useWebgl(
    "",
    useCallback((w) => {
      const { gl, createShader, dom, view } = w;

      gl?.clearColor(0, 0, 0, 1.0);
      gl?.clear(gl.COLOR_BUFFER_BIT);

      const shader = createShader(pvsAttr, pfs);
      shader.use();

      const points: number[][] = [];
      const colors: number[][] = [];
      dom.addEventListener(
        "mousedown",
        (ev) => {
          let x = ev.clientX;
          let y = ev.clientY;
          const rect = (ev.target as HTMLCanvasElement).getBoundingClientRect();
          // 因为显示设置了幕布的大小(乘以dp); 此处计算需要除去
          const w = dom.width / view.dp;
          const h = dom.height / view.dp;

          x = (x - rect.left - w / 2) / (w / 2);
          y = (h / 2 - (y - rect.top)) / (h / 2);

          points.push([x, y]);

          if (x >= 0.0 && y >= 0.0) {
            colors.push([1.0, 0.0, 0.0, 1.0]);
          } else if (x < 0.0 && y < 0.0) {
            colors.push([0.0, 1.0, 0.0, 1.0]);
          } else {
            colors.push([1.0, 1.0, 1.0, 1.0]);
          }

          gl?.clear(gl.COLOR_BUFFER_BIT);

          for (let i = 0, len = points.length; i < len; i++) {
            const point = points[i];
            const color = colors[i];
            shader.setAttribV(0, [...point, 0]); // 顶点位置
            shader.setFloat("color", color); // 顶点颜色
            gl.drawArrays(gl.POINTS, 0, 1);
          }
        },
        false
      );
    }, [])
  );

  return (
    <div id="case1">
      <canvas
        ref={ref}
        width={400}
        height={400}
        style={{ width: 400, height: 400 }}
      ></canvas>
    </div>
  );
}
