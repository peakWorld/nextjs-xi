"use client";

import { useEffect, useRef } from "react";
import { state, init } from "./shared-cube";

export default function Case3_3() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    let resizeFunc = () => {};
    let worker: Worker;

    function startWorker() {
      const offscreen = canvas.transferControlToOffscreen();
      worker = new Worker(new URL("./worker-cube.ts", import.meta.url), { type: "module" }); // 启用我们的Worker
      worker.postMessage({ type: "init", canvas: offscreen }, [offscreen]); // 把 offscreen 对象传入给它

      function sendSize() {
        worker.postMessage({ type: "size", width: canvas.clientWidth, height: canvas.clientHeight }); // 发送canvas最新尺寸
      }
      resizeFunc = sendSize;
      console.log("using OffscreenCanvas");
    }

    function startMainPage() {
      init({ canvas });

      function sendSize() {
        state.width = canvas.clientWidth;
        state.height = canvas.clientHeight;
      }
      resizeFunc = sendSize;
      console.log("using regular canvas");
    }

    // @ts-ignore
    if (canvas.transferControlToOffscreen) {
      startWorker(); // worker 渲染
    } else {
      startMainPage(); // 主进程 渲染
    }
    resizeFunc();
    window.addEventListener("resize", resizeFunc);

    return () => {
      window.removeEventListener("resize", resizeFunc);
      if (worker) worker.terminate();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
