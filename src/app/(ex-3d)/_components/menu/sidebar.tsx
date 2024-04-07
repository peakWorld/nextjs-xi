"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSearchParams, useParams } from "next/navigation";
import { type Menu } from "@/app/(ex-3d)/const";

export default function SiderBar({ menus, prefix }: { menus: Menu; prefix: string }) {
  const { type, pageId } = useParams();
  const search = useSearchParams();

  if (search.has("ms")) return null; // 隐藏菜单栏
  const current = search.get("k") ? `${pageId}?k=${search.get("k")}` : pageId;
  // 菜单状态
  menus.forEach((node) => {
    const isMatch = node.children.some((it) => it.path === current);
    node.isOpen = isMatch;
  });

  return (
    <div className="w-40 flex flex-col mr-3 p-2 bg-slate-100 overflow-y-auto flex-shrink-0">
      {menus.map((node) => (
        <details key={node.summary} open={node.isOpen} className="mt-2">
          <summary className="font-medium">{node.summary}</summary>
          <div className="ml-4">
            {node.children.map((it) => (
              <Link
                key={it.path}
                className={clsx("w-full mb-2", {
                  "text-blue-400": it.path === current,
                })}
                href={`/${prefix}/${type}/${it.path}`}
                title={it.title}
              >
                <div className="truncate mb-1">{it.title}</div>
              </Link>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
