import * as THREE from "three";
import { useEffect, useRef, MutableRefObject } from "react";
import { getCanvasRelativePosition } from "@/app/(ex-3d)/_utils/t_/common";

export function useMouse(id: string, usePx = false): MutableRefObject<THREE.Vector2> {
  const posRef = useRef(new THREE.Vector2());

  useEffect(() => {
    const canvas = document.querySelector(`#${id}`) as HTMLCanvasElement;

    function setPickPosition(event: MouseEvent | Touch) {
      const pos = getCanvasRelativePosition(event, canvas);
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
