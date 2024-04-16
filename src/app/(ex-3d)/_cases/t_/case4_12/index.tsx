"use client";

import { useEffect, useRef } from "react";
import { drawRandomDot } from "@/app/(ex-3d)/_utils/t_/common";

export default function Case4_12() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timer = -1;
    const canvas = ref.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    function render() {
      drawRandomDot(ctx);
      timer = requestAnimationFrame(render);
    }
    timer = requestAnimationFrame(render);

    return () => {
      if (timer > -1) cancelAnimationFrame(timer);
    };
  }, []);

  return <canvas ref={ref} />;
}
