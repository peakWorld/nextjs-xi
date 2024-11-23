"use client";

import { useEffect, useRef, useState } from "react";
import { App } from "./_app";
import "./page.scss";

function Stack() {
  const ref = useRef<App>();

  useEffect(() => {
    const app = new App();

    ref.current = app;

    return () => {
      app.destroy();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    ref.current?.world.restart();
  };

  const handleStart = (e: React.MouseEvent<HTMLDivElement>) => {
    ref.current?.world.clickContainer();
  };

  return (
    <div className="stack h-full w-full" id="craft" onClick={handleStart}>
      <div className="tool" onClick={handleClick}>
        Reload
      </div>
    </div>
  );
}

export default Stack;
