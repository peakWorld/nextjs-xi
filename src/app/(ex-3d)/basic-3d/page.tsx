"use client";

import { useEffect, useRef } from "react";
import { App } from "@/app/(ex-3d)/basic-3d/app";
import "./index.scss";

export default function Basic3DPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const dom = canvasRef.current;
    if (!dom) return;
    const app = new App({ canvas: dom }, Array.from(document.querySelectorAll(".content > div")));
    // app.requestRenderIfNotRequested();
    return () => {
      app.dispose();
    };
  }, []);

  return (
    <div className="basic-3d flex h-full w-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="content">
        <div data-id="spring">春</div>
        <div data-id="summer">夏</div>
        <div data-id="autumn">秋</div>
        <div data-id="winter">冬</div>
      </div>
    </div>
  );
}
