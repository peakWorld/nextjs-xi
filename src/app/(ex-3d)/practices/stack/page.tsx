"use client";

import { useEffect, useRef, useState } from "react";
import { App } from "./_app";
import "./page.scss";

enum Status {
  running,
  paused,
  finished,
}

function Stack() {
  const appRef = useRef<App>();
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState(Status.paused);

  useEffect(() => {
    const app = new App();

    app.world.on("start", () => {
      setStatus(Status.running);
    });

    app.world.on("level", (value: number) => {
      setLevel(value);
    });

    app.world.on("end", () => {
      setStatus(Status.finished);
      setLevel(0);
    });

    appRef.current = app;

    return () => {
      app.destroy();
    };
  }, []);

  const handleGo = (evt: any) => {
    appRef.current?.world.start();
  };

  const handleRestart = (evt: any) => {
    setStatus(Status.paused);
    appRef.current?.world.reStart();
  };

  return (
    <div className="stack h-full w-full" id="craft">
      <div className="tool">
        {status === Status.running && <div>Level: {level}</div>}
        {status === Status.finished && (
          <div onClick={handleRestart} className="cursor">
            Restart !
          </div>
        )}
        {status === Status.paused && (
          <div onClick={handleGo} className="cursor">
            Go !
          </div>
        )}
      </div>
    </div>
  );
}

export default Stack;
