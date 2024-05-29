"use client";

import { useEffect, useRef } from "react";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize, loadImage, computeKernelWeight } from "@/app/(ex-3d)/_utils/w_/util";
import { createAndSetupTexture } from "@/app/(ex-3d)/_utils/w_/gl";
import vs from "./vs.multi.glsl";
import fs from "./fs.multi.glsl";

const texCoords = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]; // 纹理坐标
// 卷积核
var kernels = {
  normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  gaussianBlur: [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045],
  gaussianBlur2: [1, 2, 1, 2, 4, 2, 1, 2, 1],
  gaussianBlur3: [0, 1, 0, 1, 1, 1, 0, 1, 0],
  unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
  sharpness: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  sharpen: [-1, -1, -1, -1, 16, -1, -1, -1, -1],
  edgeDetect: [-0.125, -0.125, -0.125, -0.125, 1, -0.125, -0.125, -0.125, -0.125],
  edgeDetect2: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
  edgeDetect3: [-5, 0, 0, 0, 0, 0, 0, 0, 5],
  edgeDetect4: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
  edgeDetect5: [-1, -1, -1, 2, 2, 2, -1, -1, -1],
  edgeDetect6: [-5, -5, -5, -5, 39, -5, -5, -5, -5],
  sobelHorizontal: [1, 2, 1, 0, 0, 0, -1, -2, -1],
  sobelVertical: [1, 0, -1, 2, 0, -2, 1, 0, -1],
  previtHorizontal: [1, 1, 1, 0, 0, 0, -1, -1, -1],
  previtVertical: [1, 0, -1, 1, 0, -1, 1, 0, -1],
  boxBlur: [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111],
  triangleBlur: [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625],
  emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
};

const effects = ["gaussianBlur", "emboss"];

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
      const program = new Shader(gl, vs, fs).createProgram();
      if (!program) return;

      const image = await loadImage("/w_/leaves.jpg");

      // 2. 给GLSL程序提供数据
      var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
      var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

      var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      var imageLocation = gl.getUniformLocation(program, "u_image");
      var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
      var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
      var flipYLocation = gl.getUniformLocation(program, "u_flipY");

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

      // 3. 绑定原始纹理
      var originalImageTexture = createAndSetupTexture(gl);
      var mipLevel = 0;
      var internalFormat = gl.RGBA;
      var srcFormat = gl.RGBA;
      var srcType = gl.UNSIGNED_BYTE;
      gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, image);

      // 4. 创建两个帧缓冲区<绑定空白纹理>
      var textures: WebGLTexture[] = [];
      var framebuffers: WebGLFramebuffer[] = [];
      for (var ii = 0; ii < 2; ++ii) {
        var texture = createAndSetupTexture(gl);

        var mipLevel = 0; // 指定详细级别
        var internalFormat = gl.RGBA; // 指定纹理中的颜色组件
        var border = 0; // 必须为 0
        var srcFormat = gl.RGBA; // 指定纹理的数据格式
        var srcType = gl.UNSIGNED_BYTE; // 指定纹理的数据类型
        var data = null; // data 没有值意味着创建一个空白的纹理
        gl.texImage2D(
          gl.TEXTURE_2D,
          mipLevel,
          internalFormat,
          image.width,
          image.height,
          border,
          srcFormat,
          srcType,
          data
        );

        // 4.1 创建一个帧缓冲区
        var fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        // 4.2 绑定纹理到帧缓冲
        var attachmentPoint = gl.COLOR_ATTACHMENT0; // 将纹理附加到帧缓冲区的颜色缓冲区
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, mipLevel);

        textures.push(texture as WebGLTexture);
        framebuffers.push(fbo as WebGLFramebuffer);
      }

      // 设置帧缓冲区相关配置
      function setFramebuffer(fbo: WebGLFramebuffer | null, width: number, height: number) {
        if (!gl) return;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); // 绑定帧缓冲区
        gl.uniform2f(resolutionLocation, width, height); // 设置窗口大小

        // 帧缓冲的大小和画布的大小不同，所以需要给帧缓冲设置一个合适的视图大小让它渲染到对应的纹理上
        gl.viewport(0, 0, width, height); // 设置视口区域
      }

      function drawWithKernel(name: keyof typeof kernels) {
        if (!gl) return;
        gl.uniform1fv(kernelLocation, kernels[name]);
        gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
      }

      // 5. 绘图
      function drawScene() {
        resizeCanvasToDisplaySize(ref.current as HTMLCanvasElement); // 调整画布大小
        if (!gl || !program) return;

        // 5.1 从裁剪空间转换到屏幕空间
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // 5.2 清空画布缓冲区
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 5.3 指定程序
        gl.useProgram(program);

        // 5.4 使用 属性状态集
        gl.bindVertexArray(vao);

        // 5.5 激活纹理单元<绑定纹理到纹理单元>
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

        // 5.6 设置程序中全局变量
        gl.uniform1i(imageLocation, 0);
        gl.uniform1f(flipYLocation, 1); // 帧缓冲区不展示, 无需反转Y轴

        // 5.7 绘制多次<使用帧缓冲区>
        for (let i = 0, len = effects.length; i < len; i++) {
          setFramebuffer(framebuffers[i % 2], image.width, image.height); // 绑定帧缓冲区
          drawWithKernel(effects[i] as any); // 绘制一次, 将结果缓存到帧缓冲区<纹理>
          gl.bindTexture(gl.TEXTURE_2D, textures[i % 2]); // 绑定纹理<绘制结果>
        }

        // 5.8 绘制最后结果
        gl.uniform1f(flipYLocation, -1); // 画布需展示, 反转Y轴
        setFramebuffer(null, gl.canvas.width, gl.canvas.height); // 重置画布相关设置
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        drawWithKernel("normal");

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
