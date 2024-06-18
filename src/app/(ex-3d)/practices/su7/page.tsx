"use client";

import { useEffect, useRef } from "react";
import { Craft } from "@/libs/craft";

function ReplicaSu7() {
  useEffect(() => {
    const craft = new Craft();

    return () => {
      craft.destroy();
    };
  }, []);

  return <div id="craft" />;
}

export default ReplicaSu7;
