"use client";

import { useEffect, useRef } from "react";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

interface State {
  camera: {
    fovy: number;
    position: Tuple<number, 3>;
  };
}

export default function useGui<T extends State>(init: T) {
  const state = useRef<State>(init);
  const guiRef = useRef<GUI>();

  useEffect(() => {
    const params = state.current;
    const gui = new GUI();
    const folder = gui.addFolder("基础");
    folder.add(params.camera, "fovy", 30, 75).step(0.5).name("相机角度");
    folder.add(params.camera.position, "0", -15, 15).step(1).name("相机位置x");
    folder.add(params.camera.position, "1", -15, 15).step(1).name("相机位置y");
    folder.add(params.camera.position, "2", -15, 15).step(1).name("相机位置z");
    folder.open();
    guiRef.current = gui;

    return () => {
      gui.destroy();
    };
  }, []);

  return { gui: guiRef.current, state: state.current };
}
