"use client";

import { useEffect, useRef, useState } from "react";
import { App } from "./_app";
import "./page.scss";

function Stack() {
  const appRef = useRef<App>();
  const [level, setLevel] = useState(0);
  const [running, setRun] = useState(false);

  useEffect(() => {
    const app = new App();

    app.world.on("start", () => {
      setRun(true);
    });

    app.world.on("level", (value: number) => {
      setLevel(value);
    });

    app.world.on("end", () => {
      setRun(false);
      setLevel(0);
    });

    appRef.current = app;

    return () => {
      app.destroy();
    };
  }, []);

  const handleGo = () => {
    appRef.current?.world.emit("start");
  };

  return (
    <div className="stack h-full w-full" id="craft">
      <div className="tool">{running ? <div>Level: {level}</div> : <div onClick={handleGo}>GO!</div>}</div>
    </div>
  );
}

export default Stack;
