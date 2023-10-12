"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { type MkMeta } from "@/lib/posts";

interface Props {
  menus: MkMeta[];
}

export default function SiderBar({ menus }: Props) {
  const segment = useSelectedLayoutSegment();

  return (
    <>
      {menus.map((menu) => (
        <Link
          key={menu.id}
          className={clsx("w-full mb-2", {
            "text-blue-400": menu.id === segment,
          })}
          href={`/article/${menu.id}`}
        >
          <div className="truncate mb-1">{menu.id}</div>
          <div className="text-xs">{menu.date}</div>
        </Link>
      ))}
    </>
  );
}
