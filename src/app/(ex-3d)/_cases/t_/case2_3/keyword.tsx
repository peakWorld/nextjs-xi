"use client";

import { useEffect, useRef } from "react";
import "./keyword.scss";

export default function Case2_3() {
  useEffect(() => {
    document.querySelectorAll("canvas").forEach((canvas) => {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      function draw(str: string) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(str, canvas.width / 2, canvas.height / 2);
      }
      draw(canvas.id);

      canvas.addEventListener("focus", () => {
        draw("has focus press a key");
      });

      canvas.addEventListener("blur", () => {
        draw("lost focus");
      });

      canvas.addEventListener("keydown", (e) => {
        draw(`keyCode: ${e.keyCode}`);
      });
    });
  }, []);

  return (
    <div className="wrap2_3">
      <canvas id="c1"></canvas>
      <canvas id="c2" tabIndex={0}></canvas>
      <canvas id="c3" tabIndex={1}></canvas>
    </div>
  );
}
