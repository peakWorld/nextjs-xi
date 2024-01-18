"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSelectedLayoutSegment, useSearchParams } from "next/navigation";
import { type ExSettings, EXTYPE } from "@/app/(ex-3d)/const";

interface Props {
  menus: ExSettings;
}

export default function SiderBar({ menus }: Props) {
  const segment = useSelectedLayoutSegment() as keyof typeof EXTYPE;
  const params = useSearchParams();
  // 隐藏菜单栏
  if (params.has("ms")) return null;

  const data = menus[EXTYPE[segment]] ?? [];
  return (
    <div className="w-32 flex flex-col items-center mr-3 p-2 bg-slate-100">
      {data.map((it) => (
        <Link
          key={it.path}
          className={clsx("w-full mb-2", {
            "text-blue-400": it.path === segment,
          })}
          href={`/${segment}/${it.path}`}
        >
          <div className="truncate mb-1">{it.title}</div>
        </Link>
      ))}
    </div>
  );
}
