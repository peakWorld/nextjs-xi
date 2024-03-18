"use client";

import { useEffect, useRef } from "react";
import { state, init, pickPosition } from "./shared-picking";

export default function Case3_3() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
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
      sendMouse = (x, y) => {
        worker.postMessage({ type: "mouse", x, y });
      };
      console.log("using OffscreenCanvas");
    }

    function startMainPage() {
      init({ canvas });

      sendSize = () => {
        state.width = canvas.clientWidth;
        state.height = canvas.clientHeight;
      };
      sendMouse = (x, y) => {
        pickPosition.x = x;
        pickPosition.y = y;
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

    function getCanvasRelativePosition(event: MouseEvent | Touch) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) * canvas.width) / rect.width,
        y: ((event.clientY - rect.top) * canvas.height) / rect.height,
      };
    }
    function setPickPosition(event: MouseEvent | Touch) {
      const pos = getCanvasRelativePosition(event);
      sendMouse((pos.x / canvas.width) * 2 - 1, (pos.y / canvas.height) * -2 + 1); // 标准化坐标值
    }

    function clearPickPosition() {
      sendMouse(-100000, -100000);
    }

    window.addEventListener("mousemove", setPickPosition);
    window.addEventListener("mouseout", clearPickPosition);
    window.addEventListener("mouseleave", clearPickPosition);

    window.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
        setPickPosition(event.touches[0]);
      },
      { passive: false }
    );
    window.addEventListener("touchmove", (event) => {
      setPickPosition(event.touches[0]);
    });
    window.addEventListener("touchend", clearPickPosition);

    return () => {
      window.removeEventListener("resize", sendSize);
      // 太多不处理了
      if (worker) worker.terminate();
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}
