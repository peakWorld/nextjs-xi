"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

export default function Case4_8() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState({ w: 0, h: 0 });
  const [size, setSize] = useState(8);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    function drawColorCubeImage(ctx: CanvasRenderingContext2D | null, size: number) {
      const canvas = ctx!.canvas;
      canvas.width = size * size;
      canvas.height = size;

      // 模拟3维查找表 将Z轴切面在2D上平铺, 最终形成2D纹理
      for (let zz = 0; zz < size; ++zz) {
        for (let yy = 0; yy < size; ++yy) {
          for (let xx = 0; xx < size; ++xx) {
            const r = Math.floor((xx / (size - 1)) * 255);
            const g = Math.floor((yy / (size - 1)) * 255);
            const b = Math.floor((zz / (size - 1)) * 255);
            ctx!.fillStyle = `rgb(${r},${g},${b})`;
            ctx!.fillRect(zz * size + xx, yy, 1, 1);
          }
        }
      }
      setState({ w: canvas.width, h: canvas.height });
    }

    drawColorCubeImage(ctx, size);
  }, [size]);

  const handleChangeSize = (evt: ChangeEvent<HTMLDivElement>) => {
    setSize(evt.target.value);
  };

  const handleSave = () => {
    const canvas = ref.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx!.canvas.toBlob((blob) => {
      if (!blob) return;

      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `identity-lut-s${ctx!.canvas.height}.png`;
      a.click();
    });
  };

  return (
    <div className="w-full h-full">
      <div style={{ marginBottom: 32 }}>
        size: <input id="size" value={size} min="2" max="64" onChange={handleChangeSize} />
      </div>
      <div>
        <button type="button" onClick={handleSave}>
          Save...
        </button>
      </div>
      <div>
        <canvas ref={ref} style={{ minWidth: 512, minHeight: 64, imageRendering: "pixelated" }} />
      </div>
      <div>
        (note: actual image size is <span>{state.w}</span>x<span>{state.h}</span>)
      </div>
    </div>
  );
}
