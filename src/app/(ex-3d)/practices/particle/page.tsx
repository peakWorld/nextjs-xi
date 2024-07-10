"use client";

import { useEffect } from "react";
import { App } from "./_app";
import "./page.scss";

function Particle() {
  useEffect(() => {
    const app = new App();

    return () => {
      app.destroy();
    };
  }, []);

  return <div className="particle h-full w-full" id="craft"></div>;
}

export default Particle;
