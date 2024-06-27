"use client";

import { useEffect } from "react";
import { App } from "./_app";
import "./page.scss";

function Stack() {
  useEffect(() => {
    const app = new App();
    return () => {
      app.destroy();
    };
  }, []);

  return <div className="stack h-full w-full" id="craft" />;
}

export default Stack;
