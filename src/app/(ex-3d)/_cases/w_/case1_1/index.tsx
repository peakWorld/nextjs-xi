"use client";

import { useEffect, useRef } from "react";
import { Shader } from "@/app/(ex-3d)/_utils/w_/shader";
import { resizeCanvasToDisplaySize } from "@/app/(ex-3d)/_utils/w_/util";
import vs from "./vs.glsl";
import fs from "./fs.glsl";

var positions = [0, 0, 0, 0.5, 0.7, 0]; // 顶点数据<裁剪空间坐标>

export default function Case1_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gl = ref.current?.getContext("webgl2");
    if (!gl) return;
    resizeCanvasToDisplaySize(ref.current as HTMLCanvasElement);

    // 1. 在GPU上已经创建了一个GLSL程序
    const program = new Shader(gl, vs, fs).createProgram();
    if (!program) return;

    // 2. 给GLSL程序提供数据
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position"); // 查找属性的位置<在程序初始化时执行>

    // 2.1 数据存放到缓存区
    var buffer = gl.createBuffer(); // 创建缓冲区<属性从缓存区中取数据>
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // 绑定一个资源到某个绑定点<绑定点 处理许多WebGL资源,可认为是WebGL内部的全局变量>
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); // 通过绑定点把数据存放到缓冲区<将数组数据拷贝到GPU上的buffer>

    // 2.2 告诉属性如何从缓冲区取出数据
    var vao = gl.createVertexArray(); // 创建顶点数组对象<属性状态集合>
    gl.bindVertexArray(vao); // 绑定这个顶点数组到WebGL<使所有属性的设置能够应用到 属性状态集>
    gl.enableVertexAttribArray(positionAttributeLocation); // 启用属性<使属性生效>

    var size = 2; // 属性的分量数量<x,y,z,w>。在顶点着色器中a_position的类型是vec4, 即获取前2个分量x、y，z和w分别被默认设置为0和1
    var type = gl.FLOAT; // 分量的数据类型。此处是32位浮点数
    var normalize = false; // 是否将非浮点数数据类型的值标准化到[0, 1]（无符号类型）或[-1, 1]（有符号类型）范围。此处不进行标准化
    var stride = 0; // 连续属性之间的间隔。此处设置为0, 表示属性在缓冲区中紧密排列（即没有额外的空间） 其等于size * sizeof(type)
    var offset = 0; // 第一个属性的位置。如果缓冲区中的数据是顶点坐标和纹理坐标交替排列，那么顶点坐标的偏移量为0，纹理坐标的偏移量为顶点坐标所占用的字节数。
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset); // 设置属性如何从缓存区取出数据<已绑定缓冲区buffer>

    // 3. 从裁剪空间转换到屏幕空间<将裁剪空间的-1~+1映射到x轴0~width和y轴0~height>
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 4. 清空画布颜色
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 5. 运行着色器程序
    gl.useProgram(program);

    // 6. 告诉程序 用哪个缓冲区和如何从缓冲区取出数据给到属性
    gl.bindVertexArray(vao);

    // 7. 绘制图形
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count); // 顶点着色器运行3次<count=3>

    // 注:
    // 此处 顶点着色器只是简单地从buffer中拷贝值到gl_position, 最终画出的三角形 会在裁剪空间区域。
    // 如果 想显示3D图形，则由自己决定提供从3D转换为裁剪空间的着色器
  }, []);

  return <canvas className="w-full h-full" ref={ref} />;
}
