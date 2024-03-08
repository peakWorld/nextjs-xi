"use client";

import { useEffect, useRef } from "react";

type UN = number | undefined;

export default function Case3_1() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d") as CanvasRenderingContext2D;

    async function loadFile(url: string) {
      const req = await fetch(url);
      return req.text();
    }

    function px(v: number) {
      return `${v | 0}px`;
    }

    function hsl(h: number, s: number, l: number) {
      return `hsl(${(h * 360) | 0},${(s * 100) | 0}%,${(l * 100) | 0}%)`;
    }

    function parseData(text: string) {
      const data: UN[][] = [];
      const settings: Record<string, any> = { data };
      let min: UN;
      let max: UN;

      text.split("\n").forEach((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length === 2) {
          settings[parts[0]] = parseFloat(parts[1]);
        } else if (parts.length > 2) {
          const values = parts.map((v) => {
            const value = parseFloat(v);
            if (value === settings.NODATA_value) {
              return undefined;
            }

            max = Math.max(max === undefined ? value : max, value);
            min = Math.min(min === undefined ? value : min, value);
            return value;
          });
          data.push(values);
        }
      });
      return Object.assign(settings, { min, max });
    }

    function drawData(file: Record<string, any>) {
      const { min, max, ncols, nrows, data } = file;
      const range = max - min;

      ctx.canvas.width = ncols;
      ctx.canvas.height = nrows;
      ctx.canvas.style.width = px(ncols * 2);
      ctx.fillStyle = "#444";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      data.forEach((row: UN[], latNdx: number) => {
        row.forEach((value, lonNdx) => {
          if (value === undefined) {
            return;
          }
          const amount = (value - min) / range;
          const hue = 1;
          const saturation = 1;
          const lightness = amount;
          ctx.fillStyle = hsl(hue, saturation, lightness);
          ctx.fillRect(lonNdx, latNdx, 1, 1);
        });
      });
    }

    loadFile("/t_/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc")
      .then(parseData)
      .then(drawData);
  }, []);

  return <canvas ref={ref} />;
}
