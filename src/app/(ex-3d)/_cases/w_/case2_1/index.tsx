"use client";

import { useEffect, useRef } from "react";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize, loadImage } from "@/app/(ex-3d)/_utils/w_/util";
import vs from "./vs.glsl";
import fs from "./fs.glsl";
import outside_fs from "fs.outside.glsl";

const texCoords = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]; // 纹理坐标

export default function Case2_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cb: Promise<(() => void) | undefined | void>;

    function setRectangle(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number) {
      var x1 = x;
      var x2 = x + width;
      var y1 = y;
      var y2 = y + height;
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
        gl.STATIC_DRAW
      );
    }

    async function init() {
      const gl = ref.current?.getContext("webgl2");
      if (!gl) return;

      // 1. 在GPU上已经创建了一个GLSL程序
      const program = new Shader(gl, vs, outside_fs).createProgram();
      if (!program) return;

      const image = await loadImage("/w_/leaves.jpg");

      // 2. 给GLSL程序提供数据
      var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
      var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

      var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      var imageLocation = gl.getUniformLocation(program, "u_image");

      // 2.1 收集属性的状态
      var vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      // 2.2.1 数据存放到缓存区<position>
      var positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      setRectangle(gl, 0, 0, image.width, image.height);

      // 2.2.2 属性如何从缓冲区取出数据
      gl.enableVertexAttribArray(positionAttributeLocation);
      var size = 2;
      var type = gl.FLOAT;
      var normalize = false;
      var stride = 0;
      var offset = 0;
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

      // 2.3 纹理坐标
      var texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

      gl.enableVertexAttribArray(texCoordAttributeLocation);
      var size = 2;
      var type = gl.FLOAT;
      var normalize = false;
      var stride = 0;
      var offset = 0;
      gl.vertexAttribPointer(texCoordAttributeLocation, size, type, normalize, stride, offset);

      // 3. 绑定纹理
      var texture = gl.createTexture(); // 创建纹理对象
      gl.activeTexture(gl.TEXTURE0 + 0); // 激活纹理单元0
      gl.bindTexture(gl.TEXTURE_2D, texture); // 将纹理对象 绑定到纹理单元0的2D绑定点

      // 设置参数
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // 将图像上传到纹理中
      var mipLevel = 0;
      var internalFormat = gl.RGBA; // 想要的纹理格式
      var srcFormat = gl.RGBA; // 提供的数据格式
      var srcType = gl.UNSIGNED_BYTE; // 提供的数据类型
      gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, image);

      // 4. 绘制图形
      function drawScene() {
        resizeCanvasToDisplaySize(ref.current as HTMLCanvasElement); // 调整画布大小
        if (!gl || !program) return;

        // 4.1 从裁剪空间转换到屏幕空间
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // 4.2 清空画布缓冲区
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 4.3 指定程序
        gl.useProgram(program);

        // 4.4 使用 属性状态集
        gl.bindVertexArray(vao);

        // 4.5 设置程序中全局变量
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform1i(imageLocation, 0); // 纹理单元

        // 4.6 绘制图形
        var offset = 0;
        var count = 6;
        gl.drawArrays(gl.TRIANGLES, offset, count);

        requestAnimationFrame(drawScene);
      }

      drawScene();
    }

    cb = init();
    return () => {
      cb && Promise.resolve(cb);
    };
  }, []);

  return <canvas className="w-full h-full" ref={ref} />;
}
