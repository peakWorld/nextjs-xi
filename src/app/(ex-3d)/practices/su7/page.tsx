"use client";

import { useEffect } from "react";
import { App } from "./_app";

function ReplicaSu7() {
  useEffect(() => {
    const app = new App();
    return () => {
      app.destroy();
    };
  }, []);

  return <div className="replica-su7 h-full w-full" id="craft" />;
}

export default ReplicaSu7;
