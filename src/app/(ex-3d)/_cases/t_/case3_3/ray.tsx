"use client";

import { useEffect } from "react";
import { state, init, pickPosition } from "./shared-picking";
import { useMouse } from "@/app/(ex-3d)/_hooks/useMouse";

const canvasId = "case3_3_ray";

export default function Case3_3() {
  const posRef = useMouse(canvasId);

  useEffect(() => {
    const canvas = document.querySelector(`#${canvasId}`) as HTMLCanvasElement;

    let sendSize = () => {}; // 发送重置界面大小
    let sendMouse = (...args: number[]) => {}; // 发送修改鼠标位置
    let worker: Worker;

    function startWorker() {
      const offscreen = canvas.transferControlToOffscreen();
      worker = new Worker(new URL("./worker-picking.ts", import.meta.url), { type: "module" }); // 启用我们的Worker
      worker.postMessage({ type: "init", canvas: offscreen }, [offscreen]); // 把 offscreen 对象传入给它

      sendSize = () => {
        worker.postMessage({ type: "size", width: canvas.clientWidth, height: canvas.clientHeight }); // 发送canvas最新尺寸
      };
      sendMouse = () => {
        const pos = posRef.current;
        worker.postMessage({ type: "mouse", x: pos.x, y: pos.y });
      };
      console.log("using OffscreenCanvas");
    }

    function startMainPage() {
      init({ canvas });

      sendSize = () => {
        state.width = canvas.clientWidth;
        state.height = canvas.clientHeight;
      };
      sendMouse = () => {
        const pos = posRef.current;
        pickPosition.x = pos.x;
        pickPosition.y = pos.y;
      };
      console.log("using regular canvas");
    }

    // @ts-ignore
    if (canvas.transferControlToOffscreen) {
      startWorker(); // worker 渲染
    } else {
      startMainPage(); // 主进程 渲染
    }
    sendSize();
    window.addEventListener("resize", sendSize);

    return () => {
      window.removeEventListener("resize", sendSize);
      if (worker) worker.terminate();
    };
  }, []);

  return <canvas id={canvasId} className="w-full h-full" />;
}
