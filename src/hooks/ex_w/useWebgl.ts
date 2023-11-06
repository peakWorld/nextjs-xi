"use client";

import createGl, { type Webgl } from "@/libs/webgl";
import { useEffect } from "react";

type CbRsp = void | (() => void);

export default function useWebgl(
  selector: string,
  cb: (gl: Webgl) => CbRsp | Promise<CbRsp>
) {
  useEffect(() => {
    const w = createGl({ selector });
    let cbRsp: CbRsp | Promise<CbRsp>;
    if (w.gl) {
      cbRsp = cb(w);
      window.addEventListener("resize", w.setDp, false);
      window.addEventListener("keyup", w.updateCamera, false);
      window.addEventListener("mousemove", w.updateCamera, false);
    }
    return () => {
      if (w.gl) {
        w.lose();
        window.removeEventListener("resize", w.setDp, false);
      }
      if (w.timer) {
        window.cancelAnimationFrame(w.timer);
      }
      if (cbRsp && typeof cbRsp === "function") {
        cbRsp();
      }
    };
  }, [selector, cb]);
}
