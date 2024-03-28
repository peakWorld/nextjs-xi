import * as THREE from "three";
import { useEffect, useRef, MutableRefObject } from "react";

export function useMouse(id: string, usePx = false): MutableRefObject<THREE.Vector2> {
  const posRef = useRef(new THREE.Vector2());

  useEffect(() => {
    const canvas = document.querySelector(`#${id}`) as HTMLCanvasElement;

    function getCanvasRelativePosition(event: MouseEvent | Touch) {
      const rect = canvas.getBoundingClientRect();
      // canvas.width 画布横轴像素值；rect.width canvas元素宽度
      // 将屏幕尺寸坐标转化为相对于像素的值
      return {
        x: ((event.clientX - rect.left) * canvas.width) / rect.width,
        y: ((event.clientY - rect.top) * canvas.height) / rect.height,
      };
    }
    function setPickPosition(event: MouseEvent | Touch) {
      const pos = getCanvasRelativePosition(event);
      // 像素坐标
      if (usePx) {
        posRef.current.x = pos.x;
        posRef.current.y = pos.y;
        return;
      }
      // 转换为标准坐标系
      posRef.current.x = (pos.x / canvas.width) * 2 - 1;
      posRef.current.y = (pos.y / canvas.height) * -2 + 1;
    }

    function clearPickPosition() {
      posRef.current.x = -100000;
      posRef.current.y = -100000;
    }

    clearPickPosition();

    window.addEventListener("mousemove", setPickPosition);
    window.addEventListener("mouseout", clearPickPosition);
    window.addEventListener("mouseleave", clearPickPosition);

    window.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault(); // // 阻止窗口滚动行为
        setPickPosition(event.touches[0]);
      },
      { passive: false }
    );
    window.addEventListener("touchmove", (event) => {
      setPickPosition(event.touches[0]);
    });
    window.addEventListener("touchend", clearPickPosition);

    return () => {
      window.removeEventListener("mousemove", setPickPosition);
      window.removeEventListener("mouseout", clearPickPosition);
      window.removeEventListener("mouseleave", clearPickPosition);
    };
  }, [id]);

  return posRef;
}
