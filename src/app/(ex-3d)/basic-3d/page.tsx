"use client";

import { useEffect } from "react";
import { App } from "./_app";
import "./index.scss";

export default function Basic3DPage() {
  useEffect(() => {
    const app = new App();
    return () => {
      app.destroy();
    };
  }, []);

  return (
    <div className="basic-3d flex h-full w-full" id="craft">
      <div className="content">
        <div data-id="spring">春</div>
        <div data-id="summer">夏</div>
        <div data-id="autumn">秋</div>
        <div data-id="winter">冬</div>
      </div>
    </div>
  );
}
